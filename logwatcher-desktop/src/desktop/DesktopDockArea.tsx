import React, { useCallback, useEffect, useRef } from 'react'
import DockLayout from 'rc-dock'
import type { TabData, LayoutData, PanelData } from 'rc-dock'
import 'rc-dock/dist/rc-dock-dark.css'
import type { HubConnection } from '@microsoft/signalr'
import { useTabStore } from '@shared/store/logStore'
import { LogViewer } from '@shared/components/LogViewer/LogViewer'
import { useDesktopStore } from '../store/desktopStore'
import { LocalLogViewer } from './LocalLogViewer'

interface DesktopDockAreaProps {
  hub: HubConnection
}

const MAIN_PANEL_ID = 'desktop-main-panel'

const EMPTY_LAYOUT: LayoutData = {
  dockbox: {
    mode: 'horizontal',
    children: [{ id: MAIN_PANEL_ID, tabs: [], panelLock: {} }],
  },
}

function collectIds(node: unknown): Set<string> {
  const ids = new Set<string>()
  if (!node || typeof node !== 'object') return ids
  const n = node as Record<string, unknown>
  if (Array.isArray(n.tabs)) {
    ;(n.tabs as { id?: string }[]).forEach((t) => { if (t.id) ids.add(t.id) })
  }
  if (Array.isArray(n.children)) {
    ;(n.children as unknown[]).forEach((c) => collectIds(c).forEach((id) => ids.add(id)))
  }
  return ids
}

function addTabToDock(dock: DockLayout, tabData: TabData) {
  const mainPanel = dock.find(MAIN_PANEL_ID) as PanelData | undefined
  if (mainPanel) {
    dock.dockMove(tabData, mainPanel, 'middle')
  } else {
    const layout = dock.getLayout()
    const firstPanel = dock.find((item) => 'tabs' in item) as PanelData | undefined
    if (firstPanel) {
      dock.dockMove(tabData, firstPanel, 'middle')
      return
    }
    dock.dockMove(tabData, layout.dockbox, 'middle')
  }
}

function RemoteTabTitle({ sessionId }: { sessionId: string }) {
  const tab = useTabStore((s) => s.tabs.find((t) => t.sessionId === sessionId))
  if (!tab) return null
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, userSelect: 'none' }}>
      {tab.newLinesCount > 0 && (
        <span className="tab-pill__badge">{tab.newLinesCount}</span>
      )}
      {tab.displayName}
    </span>
  )
}

export function DesktopDockArea({ hub }: DesktopDockAreaProps) {
  const dockRef = useRef<DockLayout>(null)
  const hubRef = useRef(hub)
  hubRef.current = hub

  const { tabs: remoteTabs, activeSessionId, removeTab, setActive } = useTabStore()
  const { localTabs, activeLocalTabId, closeLocalTab, setActiveLocalTab } = useDesktopStore()

  const knownIds = useRef(new Set<string>())

  const loadTab = useCallback((data: TabData): TabData => {
    const id = data.id ?? ''
    if (id.startsWith('local:')) {
      return { ...data, content: <LocalLogViewer tabId={id.slice(6)} /> }
    }
    return { ...data, content: <LogViewer sessionId={id} hub={hubRef.current} /> }
  }, [])

  // Sync remote tabs → dock (add new ones)
  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return
    remoteTabs.forEach((tab) => {
      if (knownIds.current.has(tab.sessionId)) return
      knownIds.current.add(tab.sessionId)
      addTabToDock(dock, {
        id: tab.sessionId,
        title: <RemoteTabTitle sessionId={tab.sessionId} />,
        content: <LogViewer sessionId={tab.sessionId} hub={hubRef.current} />,
        closable: true,
      })
    })
  }, [remoteTabs])

  // Sync local tabs → dock (add new ones)
  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return
    localTabs.forEach((tab) => {
      const dockId = `local:${tab.id}`
      if (knownIds.current.has(dockId)) return
      knownIds.current.add(dockId)
      addTabToDock(dock, {
        id: dockId,
        title: `📄 ${tab.displayName}`,
        content: <LocalLogViewer tabId={tab.id} />,
        closable: true,
      })
    })
  }, [localTabs])

  useEffect(() => {
    const dock = dockRef.current
    if (!dock || !activeSessionId) return
    dock.updateTab(activeSessionId, null, true)
  }, [activeSessionId])

  useEffect(() => {
    const dock = dockRef.current
    if (!dock || !activeLocalTabId) return
    dock.updateTab(`local:${activeLocalTabId}`, null, true)
  }, [activeLocalTabId])

  // When user closes a tab inside the dock, update our stores
  const handleLayoutChange = useCallback(
    (newLayout: LayoutData, currentTabId?: string) => {
      const currentIds = collectIds(newLayout.dockbox)
      if (newLayout.floatbox) collectIds(newLayout.floatbox).forEach((id) => currentIds.add(id))

      if (currentTabId) {
        if (currentTabId.startsWith('local:')) {
          setActiveLocalTab(currentTabId.slice(6))
        } else {
          setActive(currentTabId)
        }
      }

      knownIds.current.forEach((id) => {
        if (id === MAIN_PANEL_ID) return
        if (!currentIds.has(id)) {
          knownIds.current.delete(id)
          if (id.startsWith('local:')) {
            const filePath = id.slice(6)
            window.electronAPI.unwatchLocalFile(filePath).catch(() => {})
            closeLocalTab(filePath)
          } else {
            hubRef.current.invoke('CloseLog', id).catch(() => {})
            removeTab(id)
          }
        }
      })
    },
    [closeLocalTab, removeTab, setActive, setActiveLocalTab],
  )

  const hasAnyTab = remoteTabs.length > 0 || localTabs.length > 0

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {!hasAnyTab && (
        <div
          className="viewer-empty-state"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          Double-click a remote file in the browser, or{' '}
          <strong>&nbsp;drop a local log file&nbsp;</strong> here to open it.
        </div>
      )}
      <DockLayout
        ref={dockRef}
        defaultLayout={EMPTY_LAYOUT}
        loadTab={loadTab}
        onLayoutChange={handleLayoutChange}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}
