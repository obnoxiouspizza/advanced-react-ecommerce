import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import type { Product } from "../firebase/productService";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../firebase/productService";

type FormState = {
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
  ratingRate: string;
};

const emptyForm: FormState = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: "",
  ratingRate: "4.0",
};

type FakeStoreProduct = {
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating?: { rate?: number };
};

const ManageProducts = () => {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products-admin"],
    queryFn: getAllProducts,
  });

  const [createForm, setCreateForm] = useState<FormState>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingProduct = useMemo(
    () => products.find((p) => p.id === editingId) ?? null,
    [products, editingId],
  );

  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["products-admin"] });
    await qc.invalidateQueries({ queryKey: ["products"] });
    await qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      title: p.title ?? "",
      price: String(p.price ?? 0),
      category: p.category ?? "",
      description: p.description ?? "",
      image: p.image ?? "",
      ratingRate: String(p.rating?.rate ?? 0),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const doCreate = async () => {
    await createProduct({
      title: createForm.title.trim(),
      price: Number(createForm.price),
      category: createForm.category.trim(),
      description: createForm.description.trim(),
      image: createForm.image.trim(),
      rating: { rate: Number(createForm.ratingRate) },
    });

    setCreateForm(emptyForm);
    await refresh();
  };

  const doUpdate = async () => {
    if (!editingId) return;

    await updateProduct(editingId, {
      title: editForm.title.trim(),
      price: Number(editForm.price),
      category: editForm.category.trim(),
      description: editForm.description.trim(),
      image: editForm.image.trim(),
      rating: { rate: Number(editForm.ratingRate) },
    });

    cancelEdit();
    await refresh();
  };

  const seedFromFakeStore = async () => {
    if (products.length >= 8) {
      alert(
        "You already have products. Delete them first if you want to reseed.",
      );
      return;
    }

    const res = await fetch("https://fakestoreapi.com/products?limit=12");
    const data = (await res.json()) as FakeStoreProduct[];

    for (const p of data) {
      await createProduct({
        title: String(p.title ?? ""),
        price: Number(p.price ?? 0),
        category: String(p.category ?? ""),
        description: String(p.description ?? ""),
        image: String(p.image ?? ""),
        rating: { rate: Number(p.rating?.rate ?? 0) },
      });
    }

    alert("Seeded 12 products into Firestore!");
    await refresh();
  };

  // -------------------------
  // RENDER STATES
  // -------------------------
  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Manage Products</h1>
        <p className="subtle">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Manage Products</h1>
        <p className="subtle">Please login to manage products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1 className="page-title">Manage Products</h1>
        <p className="subtle">Loading products...</p>
      </div>
    );
  }

  // -------------------------
  // MAIN UI
  // -------------------------
  return (
    <div className="container">
      <h1 className="page-title">Manage Products</h1>
      <p className="subtle">
        Create / Edit / Delete products stored in Firestore.
      </p>

      <div className="row">
        <button
          className="btn btn-primary"
          type="button"
          onClick={seedFromFakeStore}
        >
          Seed 12 Products
        </button>
        <span className="subtle">
          (This pulls from FakeStore once and saves into your Firestore
          collection.)
        </span>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-body stack">
            <h3 className="section-title">Create Product</h3>

            <div className="form-grid">
              <input
                className="input full"
                placeholder="Title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Price"
                value={createForm.price}
                onChange={(e) =>
                  setCreateForm({ ...createForm, price: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Category"
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm({ ...createForm, category: e.target.value })
                }
              />

              <input
                className="input full"
                placeholder="Image URL"
                value={createForm.image}
                onChange={(e) =>
                  setCreateForm({ ...createForm, image: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Rating (0-5)"
                value={createForm.ratingRate}
                onChange={(e) =>
                  setCreateForm({ ...createForm, ratingRate: e.target.value })
                }
              />

              <textarea
                className="full"
                placeholder="Description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <button
              className="btn btn-primary"
              type="button"
              onClick={doCreate}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>

      {editingProduct && (
        <div className="section">
          <div className="card">
            <div className="card-body stack">
              <h3 className="section-title">Editing: {editingProduct.title}</h3>

              <div className="form-grid">
                <input
                  className="input full"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Price"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Category"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                />

                <input
                  className="input full"
                  placeholder="Image URL"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Rating (0-5)"
                  value={editForm.ratingRate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ratingRate: e.target.value })
                  }
                />

                <textarea
                  className="full"
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="row">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={doUpdate}
                >
                  Save Changes
                </button>
                <button className="btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hr" />

      <div className="section">
        <h3 className="section-title">All Products</h3>

        <div className="cart-list">
          {products.map((p) => (
            <div key={p.id} className="cart-item">
              <img
                src={p.image}
                alt={p.title}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150";
                }}
              />

              <div>
                <p className="cart-item__title">{p.title}</p>
                <p className="cart-item__sub">
                  {p.category} • ${p.price} • ⭐ {p.rating?.rate ?? 0}
                </p>
              </div>

              <div className="row">
                <button
                  className="btn"
                  type="button"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={async () => {
                    await deleteProduct(p.id);
                    if (editingId === p.id) cancelEdit();
                    await refresh();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
