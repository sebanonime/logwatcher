import React, { useCallback, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import type { HubConnection } from '@microsoft/signalr'
import { MainToolbar } from './Toolbar/MainToolbar'
import { LogBrowser } from './LogBrowser/LogBrowser'
import { DockArea } from './DockArea/DockArea'
import { FilterHistoryPanel } from './panels/FilterHistoryPanel'
import { SelectedLinePanel } from './panels/SelectedLinePanel'

interface MainLayoutProps {
  hub: HubConnection
  onSwitchPerimeter: () => void
  onLogout: () => void
}

export function MainLayout({ hub, onSwitchPerimeter, onLogout }: MainLayoutProps) {
  const [filterRefreshTick, setFilterRefreshTick] = useState(0)
  const [pendingPattern, setPendingPattern] = useState<string | null>(null)

  const handleFilterApplied = useCallback(() => {
    setFilterRefreshTick(t => t + 1)
  }, [])

  const handleSelectHistoryPattern = useCallback((pattern: string) => {
    setPendingPattern(pattern)
  }, [])

  // NOTE: react-resizable-panels v4 — numeric defaultSize = pixels, string = percent
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <MainToolbar
        hub={hub}
        onSwitchPerimeter={onSwitchPerimeter}
        onLogout={onLogout}
        onFilterApplied={handleFilterApplied}
        pendingPattern={pendingPattern}
        onPendingPatternConsumed={() => setPendingPattern(null)}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Group orientation="horizontal" style={{ height: '100%', width: '100%' }}>

          {/* Left: LogBrowser — 25% of width */}
          <Panel defaultSize="25" minSize="200px" maxSize="45">
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <LogBrowser />
            </div>
          </Panel>

          <Separator style={{ width: 4, background: '#374151', cursor: 'col-resize', flexShrink: 0 }} />

          {/* Right: vertical split — log tabs on top, bottom strip below */}
          <Panel defaultSize="75" style={{ minWidth: 0 }}>
            <Group orientation="vertical" style={{ height: '100%' }}>

              {/* Log area — 75% of height */}
              <Panel defaultSize="75" style={{ position: 'relative', minHeight: 0 }}>
                <DockArea hub={hub} />
              </Panel>

              <Separator style={{ height: 4, background: '#374151', cursor: 'row-resize', flexShrink: 0 }} />

              {/* Bottom strip — 25% of height */}
              <Panel defaultSize="25" minSize="80px">
                <Group orientation="horizontal" style={{ height: '100%' }}>
                  <Panel defaultSize="50" minSize="20">
                    <FilterHistoryPanel
                      refreshTick={filterRefreshTick}
                      onSelectPattern={handleSelectHistoryPattern}
                    />
                  </Panel>

                  <Separator style={{ width: 4, background: '#374151', cursor: 'col-resize', flexShrink: 0 }} />

                  <Panel defaultSize="50" minSize="20">
                    <SelectedLinePanel />
                  </Panel>
                </Group>
              </Panel>

            </Group>
          </Panel>

        </Group>
      </div>
    </div>
  )
}
