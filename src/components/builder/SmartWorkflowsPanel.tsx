'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  Copy,
  Clock,
  Zap,
  Globe,
  Mail,
  Bell,
  FileText,
  Image as ImageIcon,
  Layout,
  Settings,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  ArrowRight,
  MoreVertical,
  Power,
  RefreshCw,
  History,
  Target,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Modal, Switch } from '@/components/ui';

interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'event' | 'condition';
  config: {
    schedule?: string; // cron format
    event?: string;
    condition?: string;
  };
}

interface WorkflowAction {
  id: string;
  type: 'publish' | 'backup' | 'optimize' | 'notify' | 'export' | 'ai-generate' | 'transform';
  name: string;
  config: Record<string, any>;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  enabled: boolean;
  lastRun?: Date;
  runCount: number;
}

const defaultWorkflows: WorkflowItem[] = [
  {
    id: '1',
    name: 'Auto-backup on Publish',
    description: 'Creates a backup before every publish',
    trigger: { type: 'event', config: { event: 'before-publish' } },
    actions: [
      { id: '1a', type: 'backup', name: 'Create Backup', config: { includeAssets: true } },
    ],
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 30),
    runCount: 15,
  },
  {
    id: '2',
    name: 'Daily Image Optimization',
    description: 'Optimizes all images daily at midnight',
    trigger: { type: 'schedule', config: { schedule: '0 0 * * *' } },
    actions: [
      { id: '2a', type: 'optimize', name: 'Optimize Images', config: { format: 'webp', quality: 85 } },
    ],
    enabled: true,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 12),
    runCount: 7,
  },
  {
    id: '3',
    name: 'Publish Notification',
    description: 'Sends notification when site is published',
    trigger: { type: 'event', config: { event: 'after-publish' } },
    actions: [
      { id: '3a', type: 'notify', name: 'Send Email', config: { to: 'team@example.com' } },
    ],
    enabled: false,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    runCount: 5,
  },
];

const triggerTypes = [
  { type: 'manual', icon: Play, label: 'Manual', description: 'Run on demand' },
  { type: 'schedule', icon: Clock, label: 'Schedule', description: 'Run at specific times' },
  { type: 'event', icon: Zap, label: 'Event', description: 'Run on specific events' },
  { type: 'condition', icon: Target, label: 'Condition', description: 'Run when conditions are met' },
];

const actionTypes = [
  { type: 'publish', icon: Globe, label: 'Publish', description: 'Deploy your website' },
  { type: 'backup', icon: History, label: 'Backup', description: 'Create a backup' },
  { type: 'optimize', icon: Zap, label: 'Optimize', description: 'Optimize assets' },
  { type: 'notify', icon: Bell, label: 'Notify', description: 'Send notifications' },
  { type: 'export', icon: FileText, label: 'Export', description: 'Export website' },
  { type: 'ai-generate', icon: Sparkles, label: 'AI Generate', description: 'Generate content with AI' },
  { type: 'transform', icon: RefreshCw, label: 'Transform', description: 'Transform content' },
];

const eventTypes = [
  'before-publish',
  'after-publish',
  'block-added',
  'block-deleted',
  'style-changed',
  'content-changed',
];

export const SmartWorkflowsPanel: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(defaultWorkflows);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowItem | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  // Create/Edit form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTriggerType, setFormTriggerType] = useState<WorkflowTrigger['type']>('manual');
  const [formTriggerConfig, setFormTriggerConfig] = useState<WorkflowTrigger['config']>({});
  const [formActions, setFormActions] = useState<WorkflowAction[]>([]);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormTriggerType('manual');
    setFormTriggerConfig({});
    setFormActions([]);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingWorkflow(null);
    setShowCreateModal(true);
  };

  const openEditModal = (workflow: WorkflowItem) => {
    setFormName(workflow.name);
    setFormDescription(workflow.description);
    setFormTriggerType(workflow.trigger.type);
    setFormTriggerConfig(workflow.trigger.config);
    setFormActions(workflow.actions);
    setEditingWorkflow(workflow);
    setShowCreateModal(true);
  };

  const saveWorkflow = () => {
    if (!formName) return;

    const workflow: WorkflowItem = {
      id: editingWorkflow?.id || Date.now().toString(),
      name: formName,
      description: formDescription,
      trigger: { type: formTriggerType, config: formTriggerConfig },
      actions: formActions,
      enabled: editingWorkflow?.enabled ?? true,
      lastRun: editingWorkflow?.lastRun,
      runCount: editingWorkflow?.runCount || 0,
    };

    if (editingWorkflow) {
      setWorkflows(workflows.map((w) => (w.id === editingWorkflow.id ? workflow : w)));
    } else {
      setWorkflows([...workflows, workflow]);
    }

    setShowCreateModal(false);
    resetForm();
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id));
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows(
      workflows.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const runWorkflow = (id: string) => {
    // In a real implementation, this would execute the workflow
    setWorkflows(
      workflows.map((w) =>
        w.id === id ? { ...w, lastRun: new Date(), runCount: w.runCount + 1 } : w
      )
    );
  };

  const duplicateWorkflow = (workflow: WorkflowItem) => {
    const newWorkflow: WorkflowItem = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      runCount: 0,
      lastRun: undefined,
    };
    setWorkflows([...workflows, newWorkflow]);
  };

  const addAction = (type: WorkflowAction['type']) => {
    const actionDef = actionTypes.find((a) => a.type === type);
    const newAction: WorkflowAction = {
      id: Date.now().toString(),
      type,
      name: actionDef?.label || type,
      config: {},
    };
    setFormActions([...formActions, newAction]);
  };

  const removeAction = (id: string) => {
    setFormActions(formActions.filter((a) => a.id !== id));
  };

  const formatLastRun = (date?: Date) => {
    if (!date) return 'Never';
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getTriggerIcon = (type: string) => {
    const trigger = triggerTypes.find((t) => t.type === type);
    return trigger?.icon || Play;
  };

  const getActionIcon = (type: string) => {
    const action = actionTypes.find((a) => a.type === type);
    return action?.icon || Zap;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Workflow className="w-5 h-5 text-primary-500" />
            Smart Workflows
          </h2>
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Power className="w-4 h-4" />
            {workflows.filter((w) => w.enabled).length} active
          </span>
          <span className="flex items-center gap-1">
            <History className="w-4 h-4" />
            {workflows.reduce((acc, w) => acc + w.runCount, 0)} runs
          </span>
        </div>
      </div>

      {/* Workflow List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {workflows.map((workflow) => {
          const TriggerIcon = getTriggerIcon(workflow.trigger.type);
          const isExpanded = expandedWorkflow === workflow.id;

          return (
            <motion.div
              key={workflow.id}
              className={cn(
                'rounded-xl border transition-colors',
                workflow.enabled
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
              )}
            >
              {/* Workflow Header */}
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30"
                >
                  <TriggerIcon className="w-4 h-4 text-primary-600" />
                </button>

                <div className="flex-1 min-w-0" onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{workflow.name}</span>
                    {workflow.enabled && (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{workflow.description}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Switch
                    checked={workflow.enabled}
                    onCheckedChange={() => toggleWorkflow(workflow.id)}
                  />
                  <button
                    onClick={() => runWorkflow(workflow.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Run now"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {/* Trigger */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-2 block">
                          TRIGGER
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <TriggerIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm capitalize">{workflow.trigger.type}</span>
                          {workflow.trigger.config.event && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">
                              {workflow.trigger.config.event}
                            </span>
                          )}
                          {workflow.trigger.config.schedule && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">
                              {workflow.trigger.config.schedule}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-2 block">
                          ACTIONS ({workflow.actions.length})
                        </label>
                        <div className="space-y-2">
                          {workflow.actions.map((action, index) => {
                            const ActionIcon = getActionIcon(action.type);
                            return (
                              <div
                                key={action.id}
                                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                              >
                                <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-xs font-medium flex items-center justify-center text-primary-600">
                                  {index + 1}
                                </span>
                                <ActionIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{action.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Last run: {formatLastRun(workflow.lastRun)}</span>
                        <span>Total runs: {workflow.runCount}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(workflow)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateWorkflow(workflow)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {workflows.length === 0 && (
          <div className="text-center py-12">
            <Workflow className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">No workflows yet</p>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first workflow
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) resetForm();
        }}
        title={editingWorkflow ? 'Edit Workflow' : 'Create Workflow'}
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="My Workflow"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="What does this workflow do?"
              />
            </div>
          </div>

          {/* Trigger */}
          <div>
            <label className="text-sm font-medium mb-2 block">Trigger</label>
            <div className="grid grid-cols-2 gap-2">
              {triggerTypes.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <button
                    key={trigger.type}
                    onClick={() => setFormTriggerType(trigger.type as any)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-colors',
                      formTriggerType === trigger.type
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-white border-gray-200 hover:border-primary-300'
                    )}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium block">{trigger.label}</span>
                    <span className="text-xs text-gray-500">{trigger.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Trigger Config */}
            {formTriggerType === 'event' && (
              <div className="mt-3">
                <label className="text-xs text-gray-500 mb-1 block">Select Event</label>
                <select
                  value={formTriggerConfig.event || ''}
                  onChange={(e) => setFormTriggerConfig({ ...formTriggerConfig, event: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="">Select an event...</option>
                  {eventTypes.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formTriggerType === 'schedule' && (
              <div className="mt-3">
                <label className="text-xs text-gray-500 mb-1 block">Cron Schedule</label>
                <Input
                  value={formTriggerConfig.schedule || ''}
                  onChange={(e) =>
                    setFormTriggerConfig({ ...formTriggerConfig, schedule: e.target.value })
                  }
                  placeholder="0 0 * * * (every day at midnight)"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <label className="text-sm font-medium mb-2 block">Actions</label>

            {/* Selected Actions */}
            {formActions.length > 0 && (
              <div className="space-y-2 mb-3">
                {formActions.map((action, index) => {
                  const ActionIcon = getActionIcon(action.type);
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-xs font-medium flex items-center justify-center text-primary-600">
                        {index + 1}
                      </span>
                      <ActionIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm flex-1">{action.name}</span>
                      <button
                        onClick={() => removeAction(action.id)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Action */}
            <div className="grid grid-cols-3 gap-2">
              {actionTypes.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.type}
                    onClick={() => addAction(action.type as any)}
                    className="p-2 rounded-lg border border-gray-200 hover:border-primary-300 text-center transition-colors"
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={saveWorkflow} className="flex-1" disabled={!formName}>
              <Check className="w-4 h-4 mr-2" />
              {editingWorkflow ? 'Save Changes' : 'Create Workflow'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
