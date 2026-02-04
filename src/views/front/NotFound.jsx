import { Link } from "react-router";
export default function NotFound() {
  return (
    <>
      <h2>這是404頁面</h2>
      <Link to="/">
        <button type="button" className="btn btn-primary">
          回到首頁
        </button>
      </Link>
    </>
  );
}
