import Image from "next/image";

interface ProductCardProps {
    title: string;
    price: number;
    image: string;
    discount?: number;
}

const ProductCard = ({ title, price, image, discount }: ProductCardProps) => {
    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative p-2">
                <Image 
                    src={image} 
                    alt={title} 
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg"
                />
                {discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                        %{discount} İndirim
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="mt-2">
                    <span className="text-xl font-bold text-purple-600">{price} TL</span>
                    {discount && (
                        <span className="ml-2 text-sm line-through text-gray-500">
                            {price + (price * discount) / 100} TL
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;