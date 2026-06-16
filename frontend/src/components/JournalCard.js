import React from "react";

function JournalCard({ journal }) {
  return (
    <div className="card mb-4 shadow-sm p-3">
      <div className="row g-3">

        {/* Image */}
        <div className="col-md-4">
          {journal.image && (
            <img
              src={`https://travel-journal-rkzk.onrender.com${journal.image}`}
              alt={journal.title}
              className="img-fluid rounded"
            />
          )}
        </div>

        {/* Content */}
        <div className="col-md-8">
          <h4>{journal.title}</h4>
          <p className="text-muted">📍 {journal.location}</p>
          <p>{journal.content}</p>
          <p>❤️ {journal.likes}</p>
        </div>

      </div>
    </div>
  );
}

export default JournalCard;
