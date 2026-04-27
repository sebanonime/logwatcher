import React, { useCallback, useEffect, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import type { HubConnection } from '@microsoft/signalr'
import { MainToolbar } from './Toolbar/MainToolbar'
import { LogBrowser } from './LogBrowser/LogBrowser'
import { DockArea } from './DockArea/DockArea'
import { SessionInspector } from './SessionInspector'
import { useUiStore } from '../store/uiStore'

interface MainLayoutProps {
  hub: HubConnection
  onSwitchPerimeter: () => void
  onLogout: () => void
}

export function MainLayout({ hub, onSwitchPerimeter, onLogout }: MainLayoutProps) {
  const [filterRefreshTick, setFilterRefreshTick] = useState(0)
  const [pendingPattern, setPendingPattern] = useState<string | null>(null)
  const [isBrowserVisible, setIsBrowserVisible] = useState(true)
  const [isInspectorVisible, setIsInspectorVisible] = useState(true)
  const { theme } = useUiStore()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const handleFilterApplied = useCallback(() => {
    setFilterRefreshTick(t => t + 1)
  }, [])

  const handleSelectHistoryPattern = useCallback((pattern: string) => {
    setPendingPattern(pattern)
  }, [])

  const toggleBrowserPanel = useCallback(() => {
    setIsBrowserVisible(v => !v)
  }, [])

  const toggleInspectorPanel = useCallback(() => {
    setIsInspectorVisible(v => !v)
  }, [])

  return (
    <div className="app-shell">
      <MainToolbar
        hub={hub}
        onSwitchPerimeter={onSwitchPerimeter}
        onLogout={onLogout}
        onFilterApplied={handleFilterApplied}
        pendingPattern={pendingPattern}
        onPendingPatternConsumed={() => setPendingPattern(null)}
      />

      <div className="workspace-body">
        <Group orientation="horizontal" style={{ height: '100%', width: '100%' }}>

          {isBrowserVisible && (
            <Panel defaultSize={24} minSize={0}>
              <div className="workspace-panel workspace-panel--browser">
                <LogBrowser />
              </div>
            </Panel>
          )}

          {isBrowserVisible && (
            <Separator className="workspace-separator workspace-separator--vertical">
              <button
                onClick={toggleBrowserPanel}
                className="separator-toggle separator-toggle--left"
                title="Hide explorer"
                aria-label="Hide explorer"
              >
                <span aria-hidden>◂</span>
              </button>
            </Separator>
          )}

          <Panel defaultSize={isBrowserVisible || isInspectorVisible ? 52 : 100} minSize={20}>
            <div className="workspace-panel workspace-panel--viewer">
              <div className="viewer-canvas">
                {!isBrowserVisible && (
                  <button
                    onClick={toggleBrowserPanel}
                    className="edge-toggle edge-toggle--left"
                    title="Show explorer"
                    aria-label="Show explorer"
                  >
                    <span aria-hidden>▸</span>
                  </button>
                )}

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

                <div style={{ height: '100%', minHeight: 0 }}>
                  <DockArea hub={hub} />
                </div>
              </div>
            </div>
          </Panel>

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
