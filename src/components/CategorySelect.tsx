type Props = {
  selected: string;
  onChange: (value: string) => void;
  categories: string[];
};

const formatCategoryLabel = (cat: string) => {
  const c = (cat ?? "").trim();

  if (c.toLowerCase() === "men's clothing") return "Men's clothing";
  if (c.toLowerCase() === "women's clothing") return "Women's clothing";
  if (c.toLowerCase() === "electronics") return "Electronics";
  if (c.toLowerCase() === "jewelery") return "Jewelry";

  return c.length ? c[0].toUpperCase() + c.slice(1) : c;
};

const CategorySelect = ({ selected, onChange, categories }: Props) => {
  const clean = (categories ?? []).map((c) => (c ?? "").trim()).filter(Boolean);

  const unique = Array.from(new Set(clean));

  return (
    <select
      id="category-select"
      className="select"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by Category"
    >
      <option value="all">All</option>
      {unique.map((c) => (
        <option key={c} value={c}>
          {formatCategoryLabel(c)}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
