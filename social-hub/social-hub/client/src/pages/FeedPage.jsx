import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedAPI, replyAPI, sessionAPI } from '../api';
import MessageCard from '../components/MessageCard';
import MessageModal from '../components/MessageModal';
import '../styles/feed.css';

export default function FeedPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyPage, setReplyPage] = useState(1);
  const [totalReplyPages, setTotalReplyPages] = useState(1);
  const [composingReply, setComposingReply] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await feedAPI.getMessages();
      setMessages(response.data);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompose = async (e) => {
    e.preventDefault();
    if (!composing.trim()) return;

    try {
      setSubmitting(true);
      const response = await feedAPI.createMessage(composing);
      setMessages([response.data, ...messages]);
      setComposing('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await feedAPI.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting message');
    }
  };

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);
    setReplyPage(1);
    await loadReplies(message.id, 1);
  };

  const loadReplies = async (messageId, page) => {
    try {
      setRepliesLoading(true);
      const response = await replyAPI.getReplies(messageId, page, 10);
      setReplies(response.data.replies);
      setTotalReplyPages(response.data.totalPages);
    } catch (err) {
      console.error('Error loading replies:', err);
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!composingReply.trim() || !selectedMessage) return;

    try {
      setReplySubmitting(true);
      const response = await replyAPI.createReply(selectedMessage.id, composingReply);
      setReplies([...replies, response.data]);
      setComposingReply('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating reply');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDeleteReply = async (id) => {
    try {
      await replyAPI.deleteReply(id);
      setReplies(replies.filter((r) => r.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting reply');
    }
  };

  const handleLogout = async () => {
    try {
      await sessionAPI.logout();
      onLogout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="feed-page">
      {/* Header */}
      <div className="feed-header">
        <div className="header-content">
          <h1 className="header-title">🌟 Social Hub</h1>
          <div className="header-user">
            <div className="user-name">{user?.name}</div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="feed-container">
        {/* Compose Section */}
        <div className="compose-section">
          <div className="compose-header">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="message-author">{user?.name}</div>
              <div className="message-time">What's on your mind?</div>
            </div>
          </div>

          <form onSubmit={handleCompose}>
            <textarea
              className="compose-textarea"
              placeholder="Share your thoughts..."
              value={composing}
              onChange={(e) => setComposing(e.target.value)}
              maxLength={256}
            />
            <div className="compose-footer">
              <span className={`char-counter ${composing.length > 240 ? 'warning' : ''} ${composing.length > 256 ? 'error' : ''}`}>
                {composing.length}/256
              </span>
              <button
                type="submit"
                className="compose-btn"
                disabled={!composing.trim() || submitting}
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="empty-state">
            <div className="loading">Loading...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-text">No messages yet. Be the first to post!</div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              currentUserId={user?.id}
              onView={() => handleOpenMessage(message)}
              onDelete={() => setDeleteConfirm({ type: 'message', id: message.id })}
            />
          ))
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          replies={replies}
          repliesLoading={repliesLoading}
          replyPage={replyPage}
          totalReplyPages={totalReplyPages}
          composingReply={composingReply}
          replySubmitting={replySubmitting}
          currentUserId={user?.id}
          onClose={() => setSelectedMessage(null)}
          onReplyChange={(value) => setComposingReply(value)}
          onReplySubmit={handleReply}
          onReplyDelete={(id) => setDeleteConfirm({ type: 'reply', id })}
          onPageChange={(page) => {
            setReplyPage(page);
            loadReplies(selectedMessage.id, page);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Delete?</h3>
            <p className="confirm-message">
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  if (deleteConfirm.type === 'message') {
                    handleDeleteMessage(deleteConfirm.id);
                  } else {
                    handleDeleteReply(deleteConfirm.id);
                  }
                }}
              >
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
