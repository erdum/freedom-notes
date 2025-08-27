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

function MoveNoteModal() {
  const openMoveNoteModal = useStore((state) => state.openMoveNoteModal);
  const setOpenMoveNoteModal = useStore((state) => state.setOpenMoveNoteModal);
  const setTargetFolderId = useStore((state) => state.setTargetFolderId);
  const targetFolderId = useStore((state) => state.targetFolderId);
  const folders = useStore((state) => state.folders);
  const selectedNote = useStore((state) => state.selectedNote);
  const moveNoteToFolder = useStore((state) => state.moveNoteToFolder);

  return (
    <Dialog open={!!openMoveNoteModal} onOpenChange={setOpenMoveNoteModal}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move note</DialogTitle>
            <DialogDescription>
              Select the folder where you want to move the note. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="move-to-folder">Folder</Label>
              <Select
                id="move-to-folder"
                name="move-to-folder"
                onValueChange={(value) => setTargetFolderId(value)}
                value={targetFolderId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem disabled value="def">Select a folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem
                      disabled={folder.id == openMoveNoteModal?.folderId}
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={(e) => {
                e.preventDefault();

                if (targetFolderId) {
                  moveNoteToFolder(openMoveNoteModal.id, targetFolderId);
                  setOpenMoveNoteModal(false);
                }
                setTargetFolderId("def");
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

export default MoveNoteModal;
