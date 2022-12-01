import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import css from "styled-jsx/css";
import { Tooltip } from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const style = css`
    .icon{
        margin: 0;
        font-size: 50px;
        color: green;
    }
    `;

/**테이블에 있는 내용들을 엑셀로 다운받게 하는 코드**/
const ExportExcel = ({excelData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = 'xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    return(
        <>
            <Tooltip title = "Excel Export">
                <button
                    onClick = {(e) => exportToExcel(fileName)} color = "primary"
                    ><h1 className = "icon"><FontAwesomeIcon icon={faFileExcel}/></h1>
                </button>
            </Tooltip>
            <style jsx>{style}</style>
        </>
    )
}

export default ExportExcel;