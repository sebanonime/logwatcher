import React, { useCallback, useEffect, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import type { HubConnection } from '@microsoft/signalr'
import { MainToolbar } from '@shared/components/Toolbar/MainToolbar'
import { LogBrowser } from '@shared/components/LogBrowser/LogBrowser'
import { SessionInspector } from '@shared/components/SessionInspector'
import { useUiStore } from '@shared/store/uiStore'
import { DesktopDockArea } from './DesktopDockArea'
import { LocalFileDrop } from './LocalFileDrop'
import { useDesktopStore } from '../store/desktopStore'

interface DesktopLayoutProps {
  hub: HubConnection
  onOpenPreferences: () => void
  onOpenLogBrowserSettings: () => void
  onLogout: () => void
  onChangeServer: () => void
}

/**
 * Layout for the desktop app.
 * Extends the web MainLayout with:
 *  - Local file drag-drop support (LocalFileDrop)
 *  - Combined remote + local tab area (DesktopDockArea)
 *  - "Open local file" button in the sidebar header
 *  - "Disconnect / change server" in the toolbar
 */
export function DesktopLayout({
  hub,
  onOpenPreferences,
  onOpenLogBrowserSettings,
  onLogout,
  onChangeServer,
}: DesktopLayoutProps) {
  const [filterRefreshTick, setFilterRefreshTick] = useState(0)
  const [pendingPattern, setPendingPattern] = useState<string | null>(null)
  const [pendingApplyRequest, setPendingApplyRequest] = useState<{
    id: number
    pattern: string
  } | null>(null)
  const [isBrowserVisible, setIsBrowserVisible] = useState(true)
  const [isInspectorVisible, setIsInspectorVisible] = useState(true)
  const { theme, fontFamily, fontSize } = useUiStore()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.setProperty('--user-font-family', fontFamily)
    document.documentElement.style.setProperty('--user-font-size', `${fontSize}px`)
  }, [theme, fontFamily, fontSize])

  const handleFilterApplied = useCallback(() => setFilterRefreshTick((t) => t + 1), [])

  const handleSelectHistoryPattern = useCallback((pattern: string) => {
    setPendingPattern(pattern)
  }, [])

  const handleApplyHistoryPattern = useCallback((pattern: string) => {
    setPendingPattern(pattern)
    setPendingApplyRequest({ id: Date.now(), pattern })
  }, [])

  const toggleBrowserPanel = useCallback(() => setIsBrowserVisible((v) => !v), [])
  const toggleInspectorPanel = useCallback(() => setIsInspectorVisible((v) => !v), [])

  const { openLocalTab } = useDesktopStore()

  const handleOpenLocalFile = useCallback(async () => {
    const filePath = await window.electronAPI.openFileDialog()
    if (!filePath) return
    const info = await window.electronAPI.getLocalFileInfo(filePath)
    openLocalTab(info)
    window.electronAPI.watchLocalFile(filePath).catch(() => {})
  }, [openLocalTab])

  return (
    <div className="app-shell">
      {/* ── Top toolbar (shared, same as web) ── */}
      <MainToolbar
        hub={hub}
        onOpenPreferences={onOpenPreferences}
        onFilterApplied={handleFilterApplied}
        pendingPattern={pendingPattern}
        pendingApplyRequest={pendingApplyRequest}
        onPendingPatternConsumed={() => setPendingPattern(null)}
        onPendingApplyRequestConsumed={() => setPendingApplyRequest(null)}
      />

      <div className="workspace-body">
        <Group orientation="horizontal" style={{ height: '100%', width: '100%' }}>

          {/* ── Log browser panel ── */}
          {isBrowserVisible && (
            <Panel defaultSize={24} minSize={0}>
              <div className="workspace-panel workspace-panel--browser">
                {/* Extra "open local file" button above the browser */}
                <div
                  style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  <button
                    className="toolbar-btn"
                    onClick={handleOpenLocalFile}
                    title="Open a local log file"
                  >
                    📄 Open local file…
                  </button>
                  <button
                    className="toolbar-btn toolbar-btn--ghost"
                    onClick={onLogout}
                    title="Sign out (stay on this server)"
                    style={{ marginLeft: 'auto' }}
                  >
                    Sign out
                  </button>
                  <button
                    className="toolbar-btn toolbar-btn--ghost"
                    onClick={onChangeServer}
                    title="Disconnect and change server"
                  >
                    Change server…
                  </button>
                </div>

                <LogBrowser onOpenSettings={onOpenLogBrowserSettings} />
              </div>
            </Panel>
          )}

          {isBrowserVisible && (
            <Separator className="workspace-separator workspace-separator--vertical">
              <button
                onClick={toggleBrowserPanel}
                className="separator-toggle separator-toggle--left"
                title="Hide browser"
                aria-label="Hide browser"
              >
                <span aria-hidden>◂</span>
              </button>
            </Separator>
          )}

          {/* ── Main viewer (remote + local tabs) ── */}
          <Panel defaultSize={isBrowserVisible || isInspectorVisible ? 52 : 100} minSize={20}>
            <div className="workspace-panel workspace-panel--viewer">
              <div className="viewer-canvas">
                {!isInspectorVisible && (
                  <button
                    onClick={toggleInspectorPanel}
                    className="edge-toggle edge-toggle--right"
                    title="Show inspector"
                    aria-label="Show inspector"
                  >
                    <span aria-hidden>◂</span>
                  </button>
                )}

                {!isBrowserVisible && (
                  <button
                    onClick={toggleBrowserPanel}
                    className="edge-toggle edge-toggle--left"
                    title="Show browser"
                    aria-label="Show browser"
                  >
                    <span aria-hidden>▸</span>
                  </button>
                )}

                <LocalFileDrop>
                  <div style={{ height: '100%', minHeight: 0 }}>
                    <DesktopDockArea hub={hub} />
                  </div>
                </LocalFileDrop>
              </div>
            </div>
          </Panel>

          {/* ── Session inspector panel ── */}
          {isInspectorVisible && (
            <Separator className="workspace-separator workspace-separator--vertical">
              <button
                onClick={toggleInspectorPanel}
                className="separator-toggle separator-toggle--right"
                title="Hide inspector"
                aria-label="Hide inspector"
              >
                <span aria-hidden>▸</span>
              </button>
            </Separator>
          )}

          {isInspectorVisible && (
            <Panel defaultSize={24} minSize={0}>
              <div className="workspace-panel workspace-panel--inspector">
                <SessionInspector
                  onSelectPattern={handleSelectHistoryPattern}
                  onApplyPattern={handleApplyHistoryPattern}
                  filterRefreshTick={filterRefreshTick}
                />
              </div>
            </Panel>
          )}

        </Group>
      </div>
    </div>
  )
}
