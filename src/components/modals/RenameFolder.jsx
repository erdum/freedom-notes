import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from '../../store';

function RenameFolderModal() {
  const openRenameFolderModal = useStore(
    (state) => state.openRenameFolderModal
  );
  const setOpenRenameFolderModal = useStore(
    (state) => state.setOpenRenameFolderModal
  );
  const newFolderName = useStore((state) => state.newFolderName);
  const setNewFolderName = useStore((state) => state.setNewFolderName);
  const renameFolder = useStore((state) => state.renameFolder);

  return (
    <Dialog open={!!openRenameFolderModal} onOpenChange={setOpenRenameFolderModal}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename folder</DialogTitle>
              <DialogDescription>
                Enter a new name for this folder. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="folder-name">Folder name</Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button className="cursor-pointer" variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (openRenameFolderModal && newFolderName.trim()) {
                    renameFolder(openRenameFolderModal, newFolderName);
                    setOpenRenameFolderModal(false);
                    setNewFolderName("");
                  }
                }}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors"
                type="submit"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
  );
};

export default RenameFolderModal;
