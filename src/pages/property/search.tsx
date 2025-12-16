import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const filterCategory = searchParams.get("filterCategory");
  const bedrooms = searchParams
    .getAll("bdr")
    .map(Number)
    .filter((n) => !isNaN(n));
  const bathrooms = searchParams
    .getAll("bthr")
    .map(Number)
    .filter((n) => !isNaN(n));

  return (
    <div className="py-12">
      
    </div>
  );
}
