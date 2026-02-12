import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/fakestore";
import { toTitleCase } from "../utils/format";
import "../layout.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategorySelect({ value, onChange }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p className="subtle">Loading categories...</p>;
  if (isError || !data)
    return <p className="subtle">Failed to load categories.</p>;

  return (
    <div>
      <label htmlFor="categorySelect" className="subtle">
        Category
      </label>
      <select
        id="categorySelect"
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {data.map((cat) => (
          <option key={cat} value={cat}>
            {toTitleCase(cat)}
          </option>
        ))}
      </select>
    </div>
  );
}
