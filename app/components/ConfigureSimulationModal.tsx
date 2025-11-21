'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { IconX, IconSearch } from '@tabler/icons-react';
import { Simulation, Workflow } from '../types';
import { useItems } from '../context/ItemsContext';

interface ConfigureSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: Simulation;
}

type TabType = 'playground' | 'assessment' | 'workflows';

export default function ConfigureSimulationModal({
  isOpen,
  onClose,
  simulation,
}: ConfigureSimulationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('playground');
  const [playgroundMode, setPlaygroundMode] = useState<boolean>(simulation.playgroundMode);
  const [hasAssessment, setHasAssessment] = useState<boolean>(simulation.hasAssessment);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>(simulation.selectedWorkflows || []);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { updateItem, items } = useItems();
  const modalRef = useRef<HTMLDivElement>(null);

  // Get all available workflows
  const availableWorkflows = useMemo(() => {
    return items.filter((item): item is Workflow => item.type === 'workflow');
  }, [items]);

  // Filter workflows based on search term
  const filteredWorkflows = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableWorkflows;
    }
    return availableWorkflows.filter(workflow =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableWorkflows, searchTerm]);

  // Update state when simulation changes
  useEffect(() => {
    if (isOpen && simulation) {
      setPlaygroundMode(simulation.playgroundMode);
      setHasAssessment(simulation.hasAssessment);
      setSelectedWorkflows(simulation.selectedWorkflows || []);
      setSearchTerm('');
    }
  }, [isOpen, simulation]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      // Use a small delay to ensure this runs after other click handlers
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateItem(simulation.id, {
      playgroundMode: playgroundMode,
      hasAssessment: hasAssessment,
      selectedWorkflows: selectedWorkflows,
      workflowCount: selectedWorkflows.length,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdatedBy: 'Shubham Bhatt',
    });

    onClose();
  };

  const toggleWorkflowSelection = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId)
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const handlePlaygroundToggle = () => {
    setPlaygroundMode(!playgroundMode);
  };

  const handleAssessmentToggle = () => {
    setHasAssessment(!hasAssessment);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-lg shadow-xl" 
        style={{ padding: '0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="text-xl font-semibold text-gray-800">Configure simulation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            style={{ padding: '4px' }}
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('playground');
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'playground' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'playground' ? '2px solid #3b82f6' : '2px solid transparent',
              backgroundColor: activeTab === 'playground' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Playground mode
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('assessment');
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'assessment' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'assessment' ? '2px solid #3b82f6' : '2px solid transparent',
              backgroundColor: activeTab === 'assessment' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Assessment
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('workflows');
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'workflows' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'workflows' ? '2px solid #3b82f6' : '2px solid transparent',
              backgroundColor: activeTab === 'workflows' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Select workflows
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
          {activeTab === 'playground' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Playground mode</h3>
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={playgroundMode}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePlaygroundToggle();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, playground mode links workflows with common screens in this simulation. This creates a seamless simulation experience where users can navigate through related workflows as if they were part of a single application or process.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Assessment mode</h3>
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={hasAssessment}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleAssessmentToggle();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, assessment mode allows you to add quiz questions and evaluations to this simulation. This enables you to test user knowledge and track learning progress through interactive assessments.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 className="text-base font-medium text-gray-800" style={{ marginBottom: '12px' }}>
                  Select workflows
                </h3>
                
                {/* Search Input */}
                <div style={{ 
                  position: 'relative', 
                  marginBottom: '16px' 
                }}>
                  <IconSearch 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Workflows List */}
                {filteredWorkflows.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'No workflows found matching your search.' : 'No workflows available.'}
                  </p>
                ) : (
                  <div style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '6px',
                    padding: '8px'
                  }}>
                    {filteredWorkflows.map((workflow) => (
                      <label
                        key={workflow.id}
                        className="flex items-center gap-3 cursor-pointer"
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          marginBottom: '4px',
                          backgroundColor: selectedWorkflows.includes(workflow.id) ? '#eff6ff' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedWorkflows.includes(workflow.id)) {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedWorkflows.includes(workflow.id)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedWorkflows.includes(workflow.id)}
                          onChange={() => toggleWorkflowSelection(workflow.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{workflow.name}</span>
                      </label>
                    ))}
                  </div>
                )}

                {selectedWorkflows.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedWorkflows.length} workflow{selectedWorkflows.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end" style={{ gap: '12px', padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-md"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

