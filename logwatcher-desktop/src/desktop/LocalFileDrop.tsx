import React, { useCallback, useRef, useState } from 'react'
import { useDesktopStore } from '../store/desktopStore'

interface LocalFileDropProps {
  children: React.ReactNode
}

/**
 * Wraps the dock area and intercepts drag-drop of local files.
 * Also provides a "Browse…" button via the Electron file dialog.
 */
export function LocalFileDrop({ children }: LocalFileDropProps) {
  const { openLocalTab } = useDesktopStore()
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const openFile = useCallback(
    async (filePath: string) => {
      try {
        const info = await window.electronAPI.getLocalFileInfo(filePath)
        openLocalTab(info)
        // Start watching for new content
        window.electronAPI.watchLocalFile(filePath).catch(() => {})
      } catch (err) {
        console.error('Cannot open local file:', err)
      }
    },
    [openLocalTab]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback(() => {
    dragCounter.current--
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'open'
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      for (const file of files) {
        // In Electron, File objects exposed in renderer have a real path
        const path: string = (file as unknown as { path: string }).path
        if (path) await openFile(path)
      }
    },
    [openFile]
  )

  const handleBrowse = useCallback(async () => {
    const filePath = await window.electronAPI.openFileDialog()
    if (filePath) await openFile(filePath)
  }, [openFile])

  return (
    <div
      style={{ position: 'relative', display: 'contents' }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {isDragging && (
        <div className="local-drop-overlay">
          <div className="local-drop-hint">Drop log file to open</div>
        </div>
      )}

      {/* Browse button exposed via a small button — consumed by DesktopLayout */}
      <button
        id="desktop-browse-btn"
        type="button"
        className="desktop-browse-btn"
        onClick={handleBrowse}
        title="Open local log file"
        aria-label="Open local log file"
      >
        Open local file…
      </button>
    </div>
  )
}
