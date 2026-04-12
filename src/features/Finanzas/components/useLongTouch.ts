import { useEffect } from "react";
import { useFinanzasStore } from "../store/useFinanzasStore";

let timeMouse: number = 0;
let interval: ReturnType<typeof setInterval>;

export function useLongTouch() {
  const { handleDeleteActive } = useFinanzasStore();

  useEffect(() => {
    const countTime = () => {
      interval = setInterval(() => {
        timeMouse = 500;
      }, 500);
    };

    const checkTime = () => {
      clearInterval(interval);
      if (timeMouse && timeMouse >= 500) {
        handleDeleteActive(true);
      }
      timeMouse = 0;
    };

    document
      .getElementById("seccion-registros")
      ?.addEventListener("mousedown", countTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("mouseup", checkTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchstart", countTime);
    document
      .getElementById("seccion-registros")
      ?.addEventListener("touchend", checkTime);

    return () => {
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mousedown", countTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("mouseup", checkTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("touchstart", countTime);
      document
        .getElementById("seccion-registros")
        ?.removeEventListener("touchend", checkTime);
    };
  }, [handleDeleteActive]);
}
