'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Link as LinkIcon,
  Copy,
  Check,
  MessageSquare,
  Send,
  MoreVertical,
  Crown,
  Edit3,
  Eye,
  Trash2,
  Clock,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Modal, Tooltip, TooltipProvider } from '@/components/ui';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastActive?: Date;
  cursor?: { x: number; y: number; blockId?: string };
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  blockId?: string;
  createdAt: Date;
  resolved: boolean;
  replies: Comment[];
}

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target?: string;
  timestamp: Date;
}

const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'You',
    email: 'you@example.com',
    role: 'owner',
    status: 'online',
    avatar: '',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'editor',
    status: 'online',
    lastActive: new Date(),
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    role: 'viewer',
    status: 'away',
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    authorId: '2',
    authorName: 'Sarah Johnson',
    content: 'Can we make the hero section more prominent?',
    blockId: 'hero-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    resolved: false,
    replies: [
      {
        id: '1-1',
        authorId: '1',
        authorName: 'You',
        content: 'Sure, I\'ll increase the font size and add more spacing.',
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        resolved: false,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    authorId: '3',
    authorName: 'Mike Chen',
    content: 'The color scheme looks great!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    resolved: true,
    replies: [],
  },
];

const mockActivity: ActivityItem[] = [
  { id: '1', userId: '2', userName: 'Sarah', action: 'edited', target: 'Hero Section', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', userId: '1', userName: 'You', action: 'added', target: 'Contact Form', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: '3', userId: '3', userName: 'Mike', action: 'commented on', target: 'About Section', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '4', userId: '2', userName: 'Sarah', action: 'deleted', target: 'Old Footer', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
];

export const CollaborationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'activity'>('team');
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [activity] = useState<ActivityItem[]>(mockActivity);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [shareLink, setShareLink] = useState('https://webstax.app/project/abc123');
  const [linkCopied, setLinkCopied] = useState(false);
  const [newComment, setNewComment] = useState('');

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleInvite = () => {
    if (inviteEmail) {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'offline',
      };
      setCollaborators([...collaborators, newCollaborator]);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const updateRole = (id: string, role: 'editor' | 'viewer') => {
    setCollaborators(
      collaborators.map((c) => (c.id === id ? { ...c, role } : c))
    );
  };

  const removeCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        authorId: '1',
        authorName: 'You',
        content: newComment,
        createdAt: new Date(),
        resolved: false,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const resolveComment = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: Collaborator['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'editor':
        return <Edit3 className="w-3 h-3 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'team', label: 'Team', icon: Users },
          { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.filter((c) => !c.resolved).length },
          { id: 'activity', label: 'Activity', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-primary-600 border-primary-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-600 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-4"
            >
              {/* Share Link */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <label className="text-xs text-gray-500 mb-2 block">Share Link</label>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="text-sm" />
                  <Button variant="outline" onClick={copyShareLink}>
                    {linkCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Invite Button */}
              <Button onClick={() => setShowInviteModal(true)} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite People
              </Button>

              {/* Collaborators List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Members ({collaborators.length})
                </h3>
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative">
                      {collaborator.avatar ? (
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {collaborator.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span
                        className={cn(
                          'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800',
                          getStatusColor(collaborator.status)
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {collaborator.name}
                        </span>
                        {getRoleIcon(collaborator.role)}
                      </div>
                      <span className="text-xs text-gray-500 truncate block">
                        {collaborator.email}
                      </span>
                    </div>

                    {collaborator.role !== 'owner' && (
                      <TooltipProvider>
                        <div className="flex items-center gap-1">
                          <Tooltip content="Change role">
                            <button
                              onClick={() =>
                                updateRole(
                                  collaborator.id,
                                  collaborator.role === 'editor' ? 'viewer' : 'editor'
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {collaborator.role === 'editor' ? (
                                <Edit3 className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip content="Remove">
                            <button
                              onClick={() => removeCollaborator(collaborator.id)}
                              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-4"
            >
              {/* Add Comment */}
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                />
                <Button onClick={addComment}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={cn(
                      'p-3 rounded-xl border',
                      comment.resolved
                        ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 opacity-60'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary-600">
                          {comment.authorName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {comment.content}
                        </p>
                        {comment.blockId && (
                          <button className="text-xs text-primary-500 mt-2 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            Go to block
                          </button>
                        )}

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <span className="font-medium">{reply.authorName}</span>
                                <span className="text-gray-500 ml-2 text-xs">
                                  {formatTime(reply.createdAt)}
                                </span>
                                <p className="text-gray-600 dark:text-gray-300 mt-0.5">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => resolveComment(comment.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          comment.resolved
                            ? 'bg-green-100 text-green-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4"
            >
              <div className="space-y-3">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">
                        {item.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.userName}</span>
                        <span className="text-gray-500"> {item.action} </span>
                        {item.target && (
                          <span className="font-medium">{item.target}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invite Modal */}
      <Modal
        open={showInviteModal}
        onOpenChange={(open) => setShowInviteModal(open)}
        title="Invite People"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email Address</label>
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <div className="flex gap-2">
              <button
                onClick={() => setInviteRole('editor')}
                className={cn(
                  'flex-1 p-3 rounded-xl border transition-all',
                  inviteRole === 'editor'
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-white border-gray-200 hover:border-primary-300'
                )}
              >
                <Edit3 className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Editor</span>
                <p className="text-xs text-gray-500">Can edit content</p>
              </button>
              <button
                onClick={() => setInviteRole('viewer')}
                className={cn(
                  'flex-1 p-3 rounded-xl border transition-all',
                  inviteRole === 'viewer'
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-white border-gray-200 hover:border-primary-300'
                )}
              >
                <Eye className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Viewer</span>
                <p className="text-xs text-gray-500">View only access</p>
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleInvite} className="flex-1">
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
