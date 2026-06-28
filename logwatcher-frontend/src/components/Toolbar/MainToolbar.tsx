import React, { useState, useCallback, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '../../store/logStore'
import { useFilterHistory } from '../../hooks/useFilterHistory'
import type { ContextLinesDto, FilterOptionsDto, LineDto } from '../../types'
import { useLogStore } from '../../store/logStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import { useHighlighting } from '../../hooks/useHighlighting'
import { startLogHub } from '../../signalr/logHubConnection'

interface MainToolbarProps {
  hub: HubConnection
  onOpenPreferences: () => void
  onFilterApplied?: () => void
  pendingPattern?: string | null
  pendingApplyRequest?: { id: number; pattern: string } | null
  onPendingPatternConsumed?: () => void
  onPendingApplyRequestConsumed?: () => void
}

export function MainToolbar({
  hub,
  onOpenPreferences,
  onFilterApplied,
  pendingPattern,
  pendingApplyRequest,
  onPendingPatternConsumed,
  onPendingApplyRequestConsumed,
}: MainToolbarProps) {
  const { tabs, activeSessionId, updateTab, setActive, setFilterInProgress } = useTabStore()
  const { setSelectedLine, getSelectedLine, getLine, clearBuffer } = useLogStore()
  const profiles = usePreferencesStore(state => state.profiles)
  const defaultHighlights = usePreferencesStore(state => state.defaultHighlights)
  const { addEntry } = useFilterHistory()
  const processedApplyRequestRef = useRef<number | null>(null)

  const activeTab = tabs.find(t => t.sessionId === activeSessionId)
  const activeProfile = useMemo(
    () => profiles.find(profile => profile.name === activeTab?.activeProfileName),
    [profiles, activeTab?.activeProfileName]
  )
  const activeStoredFilter = useMemo(
    () => activeProfile?.dicoStoredFilter.find(filter => filter.name === activeTab?.activeStoredFilterName),
    [activeProfile, activeTab?.activeStoredFilterName]
  )
  const tailMode = activeTab?.tailMode ?? true
  const selectedLine = activeSessionId ? getSelectedLine(activeSessionId) : null
  const activeHighlightRules = activeProfile?.dicoHighLighting ?? []
  const { highlightLine } = useHighlighting(activeHighlightRules, defaultHighlights)

  const [pattern, setPattern] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [contextModal, setContextModal] = useState<{ lines: LineDto[]; targetLineNumber: number } | null>(null)
  const contextBodyRef = useRef<HTMLDivElement>(null)
  const targetLineRef = useRef<HTMLDivElement>(null)
  const buildId = __APP_BUILD__

  useEffect(() => {
    setPattern('')
    setIsFiltering(false)
  }, [activeSessionId])

  useEffect(() => {
    if (activeStoredFilter) {
      setPattern(activeStoredFilter.filter ?? '')
    }
  }, [activeStoredFilter])

  useEffect(() => {
    if (pendingPattern) {
      setPattern(pendingPattern)
      onPendingPatternConsumed?.()
    }
  }, [pendingPattern, onPendingPatternConsumed])

  useEffect(() => {
    if (!pendingApplyRequest || !activeSessionId) return
    if (processedApplyRequestRef.current === pendingApplyRequest.id) return
    processedApplyRequestRef.current = pendingApplyRequest.id

    const applyFromHistory = async () => {
      const nextPattern = pendingApplyRequest.pattern.trim()
      setPattern(pendingApplyRequest.pattern)
      if (!nextPattern) return

      const filter: FilterOptionsDto = {
        pattern: nextPattern,
        isRegex: true,
        caseSensitive: false,
        hiddenLines: (activeProfile?.dicoHiddenLog ?? []).map(h => ({
          text: h.text,
          isRegex: h.isRegex,
          caseSensitive: h.caseSensitive,
          isActive: h.isActif,
        })),
      }

      setIsFiltering(true)
      setFilterInProgress(activeSessionId, true)
      clearBuffer(activeSessionId)
      updateTab(activeSessionId, { totalLines: 0 })
      try {
        addEntry(nextPattern)
        await hub.invoke('SetFilter', activeSessionId, filter)
        updateTab(activeSessionId, {
          isFiltered: true,
          filterPattern: nextPattern,
          filterIsRegex: true,
          filterCaseSensitive: false,
        })
        onFilterApplied?.()
      } finally {
        setIsFiltering(false)
        setFilterInProgress(activeSessionId, false)
      }
    }

    void applyFromHistory()
    onPendingApplyRequestConsumed?.()
  }, [pendingApplyRequest, activeSessionId, activeProfile, clearBuffer, updateTab, addEntry, hub, onFilterApplied, onPendingApplyRequestConsumed, setFilterInProgress])

  useEffect(() => {
    if (!contextModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContextModal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [contextModal])

  useLayoutEffect(() => {
    if (!contextModal || !targetLineRef.current || !contextBodyRef.current) return
    const targetEl = targetLineRef.current
    const container = contextBodyRef.current
    const containerHeight = container.clientHeight
    const targetOffset = targetEl.offsetTop
    const scrollTo = targetOffset - containerHeight / 2 + targetEl.clientHeight / 2
    container.scrollTop = Math.max(0, scrollTo)
  }, [contextModal])

  const applyStoredFilterNow = useCallback(async (storedFilterName?: string) => {
    if (!activeSessionId || !activeProfile) return
    const selectedFilter = activeProfile.dicoStoredFilter.find(filter => filter.name === storedFilterName)
    setPattern(selectedFilter?.filter ?? '')

    clearBuffer(activeSessionId)
    updateTab(activeSessionId, { totalLines: 0 })

    if (!selectedFilter?.filter?.trim()) {
      await hub.invoke('ClearFilter', activeSessionId)
      clearBuffer(activeSessionId)
      updateTab(activeSessionId, {
        isFiltered: false,
        activeStoredFilterName: undefined,
        filterPattern: undefined,
        filterIsRegex: undefined,
        filterCaseSensitive: undefined,
      })
      return
    }

    const filter: FilterOptionsDto = {
      pattern: selectedFilter.filter,
      isRegex: selectedFilter.isRegex,
      caseSensitive: selectedFilter.caseSensitive,
      hiddenLines: (activeProfile.dicoHiddenLog ?? []).map(h => ({
        text: h.text,
        isRegex: h.isRegex,
        caseSensitive: h.caseSensitive,
        isActive: h.isActif,
      })),
    }

    setIsFiltering(true)
    setFilterInProgress(activeSessionId, true)
    try {
      await hub.invoke('SetFilter', activeSessionId, filter)
      updateTab(activeSessionId, {
        isFiltered: true,
        filterPattern: selectedFilter.filter,
        filterIsRegex: selectedFilter.isRegex,
        filterCaseSensitive: selectedFilter.caseSensitive,
      })
      onFilterApplied?.()
    } catch (error) {
      console.error("Error or Timeout while applying filter:", error)
      updateTab(activeSessionId, { 
        errorMessage: "Filter take too much time (Samba slow). Please try again." 
      })
    } finally {
      setIsFiltering(false)
      setFilterInProgress(activeSessionId, false)
    }
  }, [hub, activeSessionId, activeProfile, clearBuffer, updateTab, onFilterApplied, setFilterInProgress])

  const applyFilter = useCallback(async () => {
    if (!activeSessionId) return
    if (!pattern.trim()) {
      clearBuffer(activeSessionId)
      updateTab(activeSessionId, { totalLines: 0 })
      await hub.invoke('ClearFilter', activeSessionId)
      clearBuffer(activeSessionId)
      updateTab(activeSessionId, {
        isFiltered: false,
        activeStoredFilterName: undefined,
        filterPattern: undefined,
        filterIsRegex: undefined,
        filterCaseSensitive: undefined,
      })
      return
    }

    const filterPayload = activeStoredFilter
      ? {
          pattern: activeStoredFilter.filter,
          isRegex: activeStoredFilter.isRegex,
          caseSensitive: activeStoredFilter.caseSensitive,
        }
      : {
          pattern: pattern.trim(),
          isRegex: true,
          caseSensitive: false,
        }

    setIsFiltering(true)
    setFilterInProgress(activeSessionId, true)
    addEntry(filterPayload.pattern.trim())
    
    const filter: FilterOptionsDto = {
      ...filterPayload,
      hiddenLines: (activeProfile?.dicoHiddenLog ?? []).map(h => ({
        text: h.text,
        isRegex: h.isRegex,
        caseSensitive: h.caseSensitive,
        isActive: h.isActif,
      })),
    }

    clearBuffer(activeSessionId)
    updateTab(activeSessionId, { totalLines: 0 })
    
    try {
      await hub.invoke('SetFilter', activeSessionId, filter)
      updateTab(activeSessionId, {
        isFiltered: true,
        filterPattern: filterPayload.pattern,
        filterIsRegex: filterPayload.isRegex,
        filterCaseSensitive: filterPayload.caseSensitive,
      })
      onFilterApplied?.()
    } finally {
      setIsFiltering(false)
      setFilterInProgress(activeSessionId, false)
    }
  }, [hub, activeSessionId, pattern, updateTab, addEntry, onFilterApplied, activeStoredFilter, activeProfile, clearBuffer, setFilterInProgress])

  const clearFilter = useCallback(async () => {
    if (!activeSessionId) return
    setPattern('')
    clearBuffer(activeSessionId)
    updateTab(activeSessionId, { totalLines: 0 })
    await hub.invoke('ClearFilter', activeSessionId)
    clearBuffer(activeSessionId)
    updateTab(activeSessionId, {
      isFiltered: false,
      activeStoredFilterName: undefined,
      filterPattern: undefined,
      filterIsRegex: undefined,
      filterCaseSensitive: undefined,
    })
  }, [hub, activeSessionId, updateTab, clearBuffer])

  const toggleTail = useCallback(async () => {
    if (!activeSessionId) return
    const next = !tailMode
    await hub.invoke('SetTail', activeSessionId, next)
    updateTab(activeSessionId, { tailMode: next })
  }, [hub, activeSessionId, tailMode, updateTab])

  const showContext = useCallback(async () => {
    if (!activeSessionId || !activeTab) return
    const selected = useLogStore.getState().getSelectedLine(activeSessionId)
    if (!selected) return

    const context = await hub.invoke<ContextLinesDto>('GetContextLines', activeSessionId, selected.lineNumber, 70)
    setContextModal({
      lines: context.lines ?? [],
      targetLineNumber: context.targetLineNumber,
    })
  }, [hub, activeSessionId, activeTab])

  const openLineInNewTab = useCallback(async () => {
    if (!activeSessionId || !activeTab) return
    const selected = useLogStore.getState().getSelectedLine(activeSessionId)
    if (!selected) return

    const profile = profiles.find(p => p.name === activeTab.activeProfileName)
    const nextSessionId = `${activeTab.serverId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const contextStart = Math.max(0, selected.lineNumber - 50)
    const contextEnd = Math.min(activeTab.totalLines - 1, selected.lineNumber + 50)
    const contextCount = Math.max(1, contextEnd - contextStart + 1)

    updateTab(activeSessionId, { tailMode: false })
    await hub.invoke('SetTail', activeSessionId, false)

    useTabStore.getState().addTab({
      sessionId: nextSessionId,
      serverId: activeTab.serverId,
      filePath: activeTab.filePath,
      displayName: `${activeTab.displayName} [${contextStart + 1}..${contextEnd + 1}]`,
      serverName: activeTab.serverName,
      totalLines: contextCount,
      sizeBytes: 0,
      isIndexed: false,
      newLinesCount: 0,
      tailMode: false,
      isFiltered: activeTab.isFiltered,
      filterPattern: activeTab.filterPattern,
      filterIsRegex: activeTab.filterIsRegex,
      filterCaseSensitive: activeTab.filterCaseSensitive,
      contextStartLine: contextStart,
      contextTotalLines: contextCount,
      activeProfileName: activeTab.activeProfileName,
      activeStoredFilterName: undefined,
    })

    try {
      await startLogHub()
      await hub.invoke('OpenLog', nextSessionId, activeTab.serverId, activeTab.filePath, {
        loadFromEnd: true,
        initialLines: 500,
        profileName: profile?.name,
        encoding: profile?.encoding,
      })

      if (profile?.name) {
        await hub.invoke('SetProfile', nextSessionId, profile.name)
      }

      if (activeTab.isFiltered && activeTab.filterPattern) {
        await hub.invoke('SetFilter', nextSessionId, {
          pattern: activeTab.filterPattern,
          isRegex: activeTab.filterIsRegex ?? true,
          caseSensitive: activeTab.filterCaseSensitive ?? false,
          hiddenLines: (profile?.dicoHiddenLog ?? []).map(h => ({
            text: h.text,
            isRegex: h.isRegex,
            caseSensitive: h.caseSensitive,
            isActive: h.isActif,
          })),
        })
      }

      await hub.invoke('SetTail', nextSessionId, false)
      await hub.invoke('RequestLines', nextSessionId, contextStart, contextCount)
      useTabStore.getState().updateTab(nextSessionId, { totalLines: contextCount })
      setSelectedLine(nextSessionId, { lineNumber: selected.lineNumber, text: selected.text })
      setActive(nextSessionId)
    } catch {
      useTabStore.getState().removeTab(nextSessionId)
    }
  }, [hub, activeSessionId, activeTab, profiles, updateTab, setSelectedLine, setActive])

  const searchNext = useCallback(async () => {
    if (!activeTab || !activeSessionId) return
    const query = pattern.trim()
    if (!query) return

    const caseSensitive = activeStoredFilter?.caseSensitive ?? false
    const isRegex = activeStoredFilter?.isRegex ?? true

    let regex: RegExp | null = null
    if (isRegex) {
      try {
        regex = new RegExp(query, caseSensitive ? '' : 'i')
      } catch {
        return
      }
    }

    const currentLine = useLogStore.getState().getSelectedLine(activeSessionId)?.lineNumber ?? -1
    const totalLines = activeTab.totalLines
    if (totalLines <= 0) return

    const isMatch = (line: string) => {
      if (isRegex && regex) return regex.test(line)
      return caseSensitive
        ? line.includes(query)
        : line.toLowerCase().includes(query.toLowerCase())
    }

    const scanOrder: number[] = []
    for (let i = currentLine + 1; i < totalLines; i++) scanOrder.push(i)
    for (let i = 0; i <= currentLine; i++) scanOrder.push(i)

    const requestedChunks = new Set<number>()
    for (const lineNumber of scanOrder) {
      const chunkStart = Math.floor(lineNumber / 300) * 300
      if (!requestedChunks.has(chunkStart)) {
        requestedChunks.add(chunkStart)
        const chunkCount = Math.min(300, totalLines - chunkStart)
        try {
          await hub.invoke('RequestLines', activeSessionId, chunkStart, chunkCount)
        } catch {
          break
        }
      }

      const line = getLine(activeSessionId, lineNumber)
      if (line !== undefined && isMatch(line)) {
        setSelectedLine(activeSessionId, { lineNumber, text: line })
        setActive(activeSessionId)
        return
      }
    }
  }, [activeTab, activeSessionId, pattern, activeStoredFilter, hub, getLine, setSelectedLine, setActive])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F3') {
        event.preventDefault()
        void searchNext()
        return
      }
      if (event.key === 'F8' && activeTab?.isFiltered) {
        event.preventDefault()
        void clearFilter()
        return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchNext, clearFilter, activeTab?.isFiltered])

  return (
    <header className="chrome-bar">
      <div className="chrome-brand">
        <div className="brand-title">LogWatcher Web</div>
      </div>

      <div className="chrome-controls">
        <div className="toolbar-filter-cluster">
          {activeTab && (
            <select
              className="control-input toolbar-profile-select"
              value={activeTab.activeProfileName ?? ''}
              onChange={async event => {
                if (!activeSessionId) return
                const nextProfileName = event.target.value || undefined
                updateTab(activeSessionId, {
                  activeProfileName: nextProfileName,
                  activeStoredFilterName: undefined,
                })
                setPattern('')
                clearBuffer(activeSessionId)
                updateTab(activeSessionId, { totalLines: 0 })
                await hub.invoke('ClearFilter', activeSessionId)
                clearBuffer(activeSessionId)
                updateTab(activeSessionId, {
                  isFiltered: false,
                  filterPattern: undefined,
                  filterIsRegex: undefined,
                  filterCaseSensitive: undefined,
                })
                try {
                  await hub.invoke('SetProfile', activeSessionId, nextProfileName ?? '')
                } catch {
                  // Ignore profile switch transport errors in UI.
                }
              }}
              title="Profile"
            >
              <option value="">Default profile</option>
              {profiles.map(profile => (
                <option key={profile.name} value={profile.name}>{profile.name}</option>
              ))}
            </select>
          )}

          {activeProfile && (
            <select
              className="control-input toolbar-stored-select"
              value={activeTab?.activeStoredFilterName ?? ''}
              onChange={async event => {
                if (!activeSessionId) return
                const nextFilterName = event.target.value || undefined
                updateTab(activeSessionId, { activeStoredFilterName: nextFilterName })
                await applyStoredFilterNow(nextFilterName)
              }}
              title="Stored filters"
            >
              <option value="">Stored filter</option>
              {activeProfile.dicoStoredFilter.map(filter => (
                <option key={filter.name} value={filter.name}>{filter.name}</option>
              ))}
            </select>
          )}

          <div className="toolbar-filter-input-wrap">
            <input
              className="control-input toolbar-filter-input"
              placeholder={activeTab ? 'Regex filter…' : 'Open a log to enable filtering'}
              value={pattern}
              disabled={!activeTab}
              onChange={e => setPattern(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilter()}
            />
            {pattern && (
              <button
                className="toolbar-filter-input-clear"
                onClick={clearFilter}
                title="Clear filter (F8)"
                aria-label="Clear filter"
              >×</button>
            )}
          </div>

          <button
            onClick={applyFilter}
            disabled={isFiltering || !activeTab}
            className="control-button control-button--ghost toolbar-action-button"
            title="Apply filter (Enter)"
          >
            {isFiltering ? '…' : '✓'}
          </button>

          <button
            onClick={searchNext}
            disabled={!activeTab || !pattern.trim()}
            className="control-button control-button--ghost toolbar-action-button"
            title="Find next (F3)"
          >
            ⌕
          </button>
        </div>

        <div className="toolbar-status-cluster">
          {activeTab && (
            <button onClick={showContext} className="control-button control-button--ghost toolbar-action-button" title="Show context">
              ☰
            </button>
          )}

          {activeTab && (
            <button onClick={openLineInNewTab} disabled={!selectedLine} className="control-button control-button--ghost toolbar-action-button" title="Open selected line in new tab">
              ⧉
            </button>
          )}

          {activeTab && (
            <button onClick={toggleTail} className={`control-button control-button--ghost toolbar-action-button ${tailMode ? 'toolbar-action-button--active' : ''}`} title={tailMode ? 'Tail on' : 'Tail off'}>
              {tailMode ? '⬇' : '⏸'}
            </button>
          )}

          {activeTab?.errorMessage && (
            <span className="status-pill status-pill--danger" title={activeTab.errorMessage}>
              {activeTab.errorMessage}
            </span>
          )}

          <button onClick={onOpenPreferences} className="control-button control-button--ghost toolbar-action-button" title="Preferences">
            ⚙
          </button>

          <span className="build-badge" title={`Frontend build ${buildId}`}>
            {buildId}
          </span>
        </div>
      </div>

      {contextModal && createPortal(
        <div className="context-modal-overlay" onClick={() => setContextModal(null)}>
          <div className="context-modal" onClick={event => event.stopPropagation()}>
            <div className="context-modal__header">
              <div className="context-modal__title">Context View</div>
              <button className="control-button control-button--ghost context-modal__close" onClick={() => setContextModal(null)}>
                ×
              </button>
            </div>
            <div className="context-modal__body" ref={contextBodyRef}>
              {contextModal.lines.map(line => {
                const isTarget = line.lineNumber === contextModal.targetLineNumber
                const segments = highlightLine(line.text)
                return (
                  <div
                    key={line.lineNumber}
                    ref={isTarget ? targetLineRef : undefined}
                    className={`context-modal__line ${isTarget ? 'context-modal__line--target' : ''}`}
                  >
                    <span className="context-modal__line-text">
                      {segments.map((seg, index) => (
                        <span
                          key={index}
                          style={{
                            color: seg.foreColor,
                            backgroundColor: seg.backColor,
                            fontWeight: seg.bold ? 'bold' : undefined,
                          }}
                        >
                          {seg.text}
                        </span>
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}