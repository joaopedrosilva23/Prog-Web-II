export default function MessageModal({
  message,
  replies,
  repliesLoading,
  replyPage,
  totalReplyPages,
  composingReply,
  replySubmitting,
  currentUserId,
  onClose,
  onReplyChange,
  onReplySubmit,
  onReplyDelete,
  onPageChange,
}) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Message Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Original Message */}
        <div className="message-card" style={{ marginBottom: '20px' }}>
          <div className="message-header">
            <div>
              <div className="message-author">{message.author.name}</div>
              <div className="message-time">{formatDate(message.createdAt)}</div>
            </div>
          </div>
          <div className="message-content">{message.content}</div>
        </div>

        {/* Replies Section */}
        <div className="replies-section">
          <h3 className="replies-title">
            💬 Replies ({replies.length})
          </h3>

          {repliesLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Loading replies...
            </div>
          ) : replies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No replies yet. Be the first!
            </div>
          ) : (
            <>
              {replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                  <div className="reply-header">
                    <div className="reply-author">{reply.author.name}</div>
                    <div className="reply-time">{formatDate(reply.createdAt)}</div>
                  </div>
                  <div className="reply-content">{reply.content}</div>
                  {currentUserId === reply.authorId && (
                    <div className="reply-actions">
                      <button
                        className="message-btn delete"
                        onClick={() => onReplyDelete(reply.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalReplyPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={replyPage === 1}
                    onClick={() => onPageChange(replyPage - 1)}
                  >
                    ← Prev
                  </button>
                  <span className="pagination-info">
                    Page {replyPage} of {totalReplyPages}
                  </span>
                  <button
                    className="pagination-btn"
                    disabled={replyPage === totalReplyPages}
                    onClick={() => onPageChange(replyPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Reply Form */}
          <form className="reply-form" onSubmit={onReplySubmit}>
            <textarea
              className="reply-textarea"
              placeholder="Write a reply..."
              value={composingReply}
              onChange={(e) => onReplyChange(e.target.value)}
              maxLength={256}
            />
            <div className="reply-actions-btn">
              <span className={`char-counter ${composingReply.length > 240 ? 'warning' : ''}`}>
                {composingReply.length}/256
              </span>
              <button
                type="submit"
                className="compose-btn"
                disabled={!composingReply.trim() || replySubmitting}
              >
                {replySubmitting ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
