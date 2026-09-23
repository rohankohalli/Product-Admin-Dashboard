import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useProductStore } from '../context/ProductStoreContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProductById } = useProductStore();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsNotFound(false);
    setErrorMessage('');

    async function fetchDetail() {
      try {
        if (!id || id.trim() === '') {
          if (isMounted) {
            setIsNotFound(true);
            setIsLoading(false);
          }
          return;
        }

        const data = await getProductById(id);

        if (isMounted) {
          if (!data) {
            setIsNotFound(true);
          } else {
            setProduct(data);
            const initialImg = (data.images && data.images.length > 0)
              ? data.images[0]
              : data.thumbnail || 'https://placehold.co/600x600?text=No+Image';
            setActiveImage(initialImg);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 404 || err.message?.includes('404')) {
            setIsNotFound(true);
          } else {
            setErrorMessage(err.message || 'Failed to load product details');
          }
          setIsLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id, getProductById]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 max-w-6xl mx-auto">
        <div className="h-4 bg-zinc-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-3">
            <div className="aspect-square bg-zinc-200 rounded-2xl w-full" />
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-zinc-200 rounded-lg" />
              <div className="w-16 h-16 bg-zinc-200 rounded-lg" />
              <div className="w-16 h-16 bg-zinc-200 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 pt-2">
            <div className="h-6 bg-zinc-200 rounded w-32" />
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-5 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-100 rounded-xl" />
            <div className="h-10 bg-zinc-200 rounded w-40" />
          </div>
        </div>
      </div>
    );
  }

  // Dedicated 404 Not Found State for wrong/invalid product IDs
  if (isNotFound) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Product Not Found
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mt-2 mb-6">
          The product with ID <code className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">{id}</code> could not be located in our inventory or may have been deleted.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Back to Products Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Generic Error State with Retry
  if (errorMessage) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Unable to Load Product</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-6">{errorMessage}</p>
        <Button
          variant="secondary"
          size="md"
          icon={RotateCcw}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!product) return null;

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : product.thumbnail ? [product.thumbnail] : [];

  const getStockBadge = (stock) => {
    if (stock <= 0) return <Badge variant="danger" dot>Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="warning" dot>Low Stock ({stock} remaining)</Badge>;
    return <Badge variant="success" dot>{stock} in Stock</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all products
        </Link>

        {product._isLocal && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-full px-3 py-1">
            <Sparkles className="w-3.5 h-3.5" />
            Locally Created Product
          </span>
        )}
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="aspect-square bg-white border border-zinc-200/90 rounded-2xl p-6 flex items-center justify-center overflow-hidden shadow-2xs">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-200 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/500x500?text=Product+Image';
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              {imagesList.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl border p-1 bg-white shrink-0 overflow-hidden cursor-pointer transition-all ${
                    activeImage === img
                      ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-xs'
                      : 'border-zinc-200/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumb ${index + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Meta */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral">{product.category || 'General'}</Badge>
              {getStockBadge(product.stock)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {product.title}
            </h1>
            {product.brand && (
              <p className="text-sm font-medium text-zinc-500 mt-1">
                Brand: <span className="text-zinc-800">{product.brand}</span>
              </p>
            )}
          </div>

          {/* Price & Rating Row */}
          <div className="flex items-baseline gap-4 py-3 border-y border-zinc-200/80">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-zinc-900">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            <div className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-sm font-medium">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">
                {typeof product.rating === 'number' ? product.rating.toFixed(2) : product.rating}
              </span>
              <span className="text-amber-700/80 text-xs">/ 5.0</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specs / Meta Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {product.sku && (
              <div className="bg-white border border-zinc-200/80 rounded-lg p-2.5">
                <span className="text-[11px] text-zinc-400 font-medium block">SKU</span>
                <span className="text-xs font-semibold text-zinc-800">{product.sku}</span>
              </div>
            )}
            {product.weight && (
              <div className="bg-white border border-zinc-200/80 rounded-lg p-2.5">
                <span className="text-[11px] text-zinc-400 font-medium block">Weight</span>
                <span className="text-xs font-semibold text-zinc-800">{product.weight} kg</span>
              </div>
            )}
            {product.availabilityStatus && (
              <div className="bg-white border border-zinc-200/80 rounded-lg p-2.5">
                <span className="text-[11px] text-zinc-400 font-medium block">Status</span>
                <span className="text-xs font-semibold text-zinc-800">{product.availabilityStatus}</span>
              </div>
            )}
          </div>

          {/* Logistics & Policies */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
            {product.warrantyInformation && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{product.warrantyInformation}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{product.shippingInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{product.returnPolicy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-zinc-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-xs text-zinc-500">
              Verified feedback and ratings for this product.
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-md">
            {product.reviews ? product.reviews.length : 0} reviews
          </span>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.date && (
                      <span className="text-[11px] text-zinc-400">
                        {new Date(rev.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-800 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-zinc-100">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-[10px] font-semibold">
                    {rev.reviewerName ? rev.reviewerName[0] : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-900 truncate">
                      {rev.reviewerName}
                    </p>
                    {rev.reviewerEmail && (
                      <p className="text-[10px] text-zinc-400 truncate">
                        {rev.reviewerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200/80 rounded-xl p-6 text-center text-xs text-zinc-500">
            No customer reviews available yet for this item.
          </div>
        )}
      </div>
    </div>
  );
}
