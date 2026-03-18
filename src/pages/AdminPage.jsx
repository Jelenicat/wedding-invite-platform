import { useParams } from "react-router-dom";

function AdminPage() {
  const { slug } = useParams();

  return (
    <div style={{padding:40}}>
      <h1>Admin panel</h1>
      <p>Wedding: {slug}</p>
    </div>
  );
}

export default AdminPage;