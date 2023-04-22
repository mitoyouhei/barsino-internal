import {CategoryType} from "../../types";

export const CategoryIcon = ({category}: { category: CategoryType }) => {
  switch (category) {
    case CategoryType.finance:
      return <i className="bi bi-coin"></i>;
    case CategoryType.gameStats:
      return <i className="bi bi-clipboard-data"></i>;
    default:
      throw new Error(`Invalid Category Type (type="${category}")`);
  }
};
