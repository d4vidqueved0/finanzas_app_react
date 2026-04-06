import { useEffect, useState } from "react";
import { getRegisterMonth } from "../api/get-register-month";
import dayjs from "dayjs";

export function DashboardLayout() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const primerDia = dayjs().startOf("month").format("YYYY-MM-DD");
      const ultimoDia = dayjs()
        .endOf("month")
        .add(1, "day")
        .format("YYYY-MM-DD");
      const { data, error } = await getRegisterMonth(primerDia, ultimoDia);
      if (error) {
        console.log(error);
        return;
      }
      const dataFormat = data.reduce((acc, cur) => {
        acc[cur.tipo] = (acc[cur.tipo] | 0) + 1;
        return acc;
      }, {});

      setData(dataFormat);
    })();
  }, []);

  return (
    <>
      <h1 className="text-5xl text-center font-bold">Dashboard</h1>
      <section>{JSON.stringify(data)}</section>
    </>
  );
}
