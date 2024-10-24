"use client";
import Basket from "@/components/Basket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const BasletInterseption = () => {
  const router = useRouter();

  const pathname = usePathname();

  function onDismiss() {
    router.back();
  }
  return (
    <Dialog
      open={pathname.includes("/basket") ? true : false}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent className="h-4/5 w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mi Orden</DialogTitle>
          <DialogDescription>
            <p>
              {" "}
              Revise los artículos de su orden y precione checkout cuando esté
              listo.{" "}
            </p>
          </DialogDescription>
        </DialogHeader>

        <Basket />
      </DialogContent>
    </Dialog>
  );
};

export default BasletInterseption;
