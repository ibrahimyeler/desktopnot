interface CategoryBoxesProps {
  category: string;
}

const CategoryBoxes = ({ category }: CategoryBoxesProps) => {
  return (
    <div>
      <h2>Category Boxes for {category}</h2>
    </div>
  );
};

export default CategoryBoxes; 