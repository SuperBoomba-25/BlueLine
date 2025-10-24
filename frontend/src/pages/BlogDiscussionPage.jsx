// frontend/src/pages/BlogDiscussionPage.jsx
import { useParams } from "react-router-dom";

function BlogDiscussionPage() {
  const { postId } = useParams();

  return (
    <div className="container">
      <h1>דיונים עבור פוסט #{postId}</h1>
      <p>כאן יוצג אשכול הדיונים. עמוד זה גלוי רק למשתמשים מחוברים.</p>
    </div>
  );
}

export default BlogDiscussionPage;
