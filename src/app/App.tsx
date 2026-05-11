import { useState } from 'react';

type Tab = 'overview' | 'powerbi' | 'mes' | 'tracks' | 'stakeholders';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="size-full flex" style={{ backgroundColor: '#FAFAF7' }}>
      {/* Sidebar */}
      <aside className="flex flex-col" style={{ width: '220px', borderRight: '1px solid #E8E8E3', backgroundColor: 'white' }}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1F3864' }}>
              <span className="font-semibold" style={{ color: 'white', fontSize: '14px' }}>HN</span>
            </div>
            <div>
              <div className="font-semibold" style={{ fontSize: '11px', color: '#1F3864', letterSpacing: '0.5px' }}>HYPERFEEDS</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Digital Tracker</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'powerbi', label: 'Power BI' },
              { id: 'mes', label: 'MES' },
              { id: 'tracks', label: 'Other Tracks' },
              { id: 'stakeholders', label: 'Stakeholders' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className="text-left px-3 py-2 transition-all duration-100"
                style={{
                  color: activeTab === item.id ? '#1F3864' : '#64748B',
                  fontWeight: activeTab === item.id ? 600 : 400,
                  fontSize: '14px',
                  borderLeft: activeTab === item.id ? '2px solid #1F3864' : '2px solid transparent',
                  marginLeft: '-1px',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-8 py-8" style={{ maxWidth: '1180px' }}>
          {/* Top Right Attribution */}
          <div className="text-right mb-6" style={{ fontSize: '11px', color: '#64748B' }}>
            Prepared by Joseph (IT Lead) · v1.0 · May 2026
          </div>

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'tracks' && <OtherTracksTab />}
        </div>

        {/* Footer */}
        <footer className="text-center py-6" style={{ fontSize: '11px', color: '#64748B' }}>
          Confidential · Hyperfeeds Animal Nutrition (Pvt) Ltd · Internal Use Only
        </footer>
      </main>
    </div>
  );
}

function OtherTracksTab() {
  const otherTracks = [
    {
      name: 'Monitoring/PC Tools',
      status: 'Deferred',
      statusColor: '#64748B',
      description: 'Automated monitoring and PC management tools for IT infrastructure. Currently deferred pending resource allocation.',
    },
    {
      name: 'FigJam Process Mapping',
      status: 'Pending',
      statusColor: '#D97706',
      description: 'Visual process mapping initiative for operations workflows. Awaiting Kudzi session to kick off discovery phase.',
    },
    {
      name: 'Microsoft Automation',
      status: 'TBC',
      statusColor: '#64748B',
      description: 'Automation workflows using Microsoft Power Platform. Scope and timeline to be confirmed with stakeholders.',
    },
    {
      name: 'IT Project Tracking Site',
      status: 'Idea',
      statusColor: '#C55A11',
      description: 'Internal dashboard for tracking digital transformation projects. This site is the MVP implementation at 80% completion.',
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#1F3864', marginBottom: '8px' }}>
        Other Tracks
      </h1>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
        Additional initiatives and exploratory projects
      </p>

      <div className="grid grid-cols-2 gap-6">
        {otherTracks.map((track, idx) => (
          <div
            key={idx}
            className="bg-white p-6 transition-all duration-100 hover:shadow-sm"
            style={{
              border: '1px solid #E8E8E3',
              borderTopWidth: '3px',
              borderTopColor: track.statusColor,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F3864' }}>
                {track.name}
              </h3>
              <span
                className="px-3 py-1"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: track.statusColor,
                  backgroundColor: `${track.statusColor}15`,
                  borderRadius: '4px',
                }}
              >
                {track.status}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
              {track.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewTab() {
  const tracks = [
    { name: 'Power BI', status: 'In Progress', statusColor: '#2E5FA3', progress: 18, nextMilestone: 'PB-02 Procurement, ETA Dec 2026' },
    { name: 'MES HYPER-MES', status: 'Testing', statusColor: '#2E5FA3', progress: 35, nextMilestone: 'Stock Take + Sage Bridge, go-live Oct 2026' },
    { name: 'Monitoring/PC Tools', status: 'Deferred', statusColor: '#64748B', progress: 0, nextMilestone: '' },
    { name: 'FigJam Process Mapping', status: 'Pending', statusColor: '#D97706', progress: 5, nextMilestone: 'Awaiting Kudzi session' },
    { name: 'Microsoft Automation', status: 'TBC', statusColor: '#64748B', progress: 0, nextMilestone: '' },
    { name: 'IT Project Tracking Site', status: 'Idea', statusColor: '#C55A11', progress: 80, nextMilestone: 'This site' },
  ];

  return (
    <div>
      {/* Programme Header */}
      <div className="mb-12">
        <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#1F3864', marginBottom: '8px' }}>
          Digital Transformation
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B' }}>
          Started March 2026 · 6 active tracks · Programme owner: MD
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        {[
          { value: '2', label: 'Tracks live' },
          { value: '12', label: 'Deliverables in flight' },
          { value: '26%', label: 'Programme complete' },
          { value: 'Oct 2026', label: 'Next major go-live' },
        ].map((kpi, idx) => (
          <div key={idx}>
            <div style={{ fontSize: '36px', fontWeight: 600, color: '#1F3864', fontVariantNumeric: 'tabular-nums' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tracks Section */}
      <div>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#1F3864', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Tracks
        </h2>
        <div className="flex flex-col">
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 py-4 transition-all duration-100 group cursor-pointer"
              style={{ borderBottom: idx === tracks.length - 1 ? 'none' : '1px solid #E8E8E3' }}
            >
              {/* Track Name */}
              <div className="flex-1" style={{ fontWeight: 600, color: '#1F3864', fontSize: '15px' }}>
                <span className="group-hover:underline decoration-1 underline-offset-2">{track.name}</span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2" style={{ width: '140px' }}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: track.statusColor }}
                />
                <span style={{ fontSize: '13px', color: '#64748B' }}>{track.status}</span>
              </div>

              {/* Next Milestone */}
              <div style={{ width: '300px', fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                {track.nextMilestone}
              </div>

              {/* Progress Bar */}
              <div style={{ width: '200px' }}>
                <div
                  className="h-2 rounded-sm overflow-hidden"
                  style={{ backgroundColor: '#E8E8E3' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${track.progress}%`,
                      backgroundColor: track.statusColor,
                    }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <div style={{ width: '50px', textAlign: 'right', fontSize: '15px', color: '#1F3864', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                {track.progress}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}