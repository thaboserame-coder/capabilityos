// Replaced by Learning.jsx — redirect stub
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Academy() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/learning", { replace: true }); }, []);
  return null;
}
