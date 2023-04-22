import {IBankrollRecord} from "../../../../types";
import React from "react";
import {useTranslation} from "react-i18next";
import {useCurrency} from "../../../../hooks/useCurrency";

interface IDetailTable {
  data: IBankrollRecord[];
}

export const DetailTable = React.memo((props: IDetailTable) => {
  const {data} = props;
  const {t} = useTranslation();
  const currency = useCurrency();

  return (
    <>
      <h2 className="pt-4">
        {t("category.finance.detail.title")}
      </h2>
      <table className="table table-striped">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{t("category.finance.detail.from")}</th>
          <th scope="col">{t("category.finance.detail.to")}</th>
          <th scope="col">{t("category.finance.detail.type")}</th>
          <th scope="col">{`${t("category.finance.detail.value")} (${currency})`}</th>
        </tr>
        </thead>
        <tbody>
        {
          data.map((record: IBankrollRecord, index: number) => {
            return (
              <tr key={index}>
                <th scope="row">{index}</th>
                <td>{record.from}</td>
                <td>{record.to}</td>
                <td>{record.type}</td>
                <td>{record.value}</td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </>
  )
})
