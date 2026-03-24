import { useAppStore } from '../../store/useAppStore';
import FormulaBar from './FormulaBar';
import Grid from './Grid';
import SheetTabs from './SheetTabs';
import Inspector from './Inspector';

export default function SpreadsheetEditor() {
  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-col flex-1 min-w-0">
        <FormulaBar />
        <Grid />
        <SheetTabs />
      </div>
      <Inspector />
    </div>
  );
}
