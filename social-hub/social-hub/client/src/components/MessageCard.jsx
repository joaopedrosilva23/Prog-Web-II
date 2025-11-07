export default function MessageCard({ message, currentUserId, onView, onDelete }) {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="message-card">
      <div className="message-header">
        <div>
          <div className="message-author">{message.author.name}</div>
          <div className="message-time">{formatDate(message.createdAt)}</div>
        </div>
        {currentUserId === message.authorId && (
          <div className="message-actions">
            <button className="message-btn delete" onClick={onDelete} title="Delete">
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="message-content">{message.content}</div>

      <div className="message-footer">
        <button className="reply-btn" onClick={onView}>
          💬 View Replies
        </button>
        <span>{message._count?.comments || 0} replies</span>
      </div>
    </div>
  );
}
