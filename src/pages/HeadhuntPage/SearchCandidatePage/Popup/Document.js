import React, {Component} from "react";

class DocumentPopup extends Component {

    render() {
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row p-3 mb20">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th className="text-center">Trường hợp</th>
                                <th className="text-center">Ví dụ nhập liệu (Input)</th>
                                <th className="text-center">Kết quả trả ra (Output)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><span className="font-bold">1. Search từng từ:&nbsp;</span><span>: nhập keywork như bình thường. Lưu ý nhập có dấu.</span>
                                </td>
                                <td>Nhân viên bán hàng</td>
                                <td>Resumes có chứa từng từ "nhân" hoặc "viên" hoặc "bán" hoặc "hàng"</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">2. Search chính xác:&nbsp;</span><span>thêm dấu ngoặc kép vào keywork cần search</span>
                                </td>
                                <td>"Nhân viên bán hàng"</td>
                                <td>Resumes có chứa cụm từ "Nhân viên bán hàng"</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">3. Search Or:&nbsp;</span><span>thêm "OR" giữa các keyword cần search</span>
                                </td>
                                <td>"Nhân viên bán hàng" OR "Nhân viên kinh doanh"</td>
                                <td>Resumes có chứa cụm từ "Nhân viên bán hàng" hoặc "Nhân viên kinh doanh"</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">4. Search AND:&nbsp;</span><span>thêm "AND" giữa các keyword cần search</span>
                                </td>
                                <td>"Nhân viên bán hàng" AND "Nhân viên kinh doanh"</td>
                                <td>Resumes có chứa cụm từ "Nhân viên bán hàng" và "Nhân viên kinh doanh"</td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">5. Search loại trừ (NOT / -) :&nbsp;</span><span>Thêm "NOT" hoặc dấu "-" trước các keyword cần loại trừ</span>
                                </td>
                                <td>
                                    <div>"nhân viên bán hàng" NOT "Nhân viên kinh doanh"</div>
                                    <div>"nhân viên bán hàng" -"Nhân viên kinh doanh"</div>
                                </td>
                                <td>Resumes có chứa cụm từ "Nhân viên bán hàng" nhưng không chứa các resumes có cụm
                                    từ"Nhân viên kinh doanh"
                                </td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">6. Search parentheses</span></td>
                                <td>HR (Manager OR Director)</td>
                                <td><span>Resumes chứa cụm từ&nbsp;</span><span
                                    className="font-bold">HR Manager&nbsp;</span><span>hoặc&nbsp;</span><span
                                    className="font-bold">HR Director</span></td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">7. Search theo tên field:&nbsp;</span><span>cấu trúc search&nbsp;</span><span className="text-italic">field_name: keyword</span>
                                </td>
                                <td>
                                    <div>name: Lê Văn A</div>
                                </td>
                                <td>Resumes có tên ứng viên là Lê Văn A
                                </td>
                            </tr>
                            <tr>
                                <td><span className="font-bold">8. Search dấu sao:&nbsp;</span><span>đặt dấu * trong keyword cần search, không khoảng cách.</span>
                                </td>
                                <td>
                                    <div>Account*, *sale*,...</div>
                                </td>
                                <td>
                                    <div>Accounting, Accountant,...</div>
                                    <div>Telesale, Saleadmin,...</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-italic">
                            <div className="text-underline font-bold">
                                Lưu ý:
                            </div>
                            <div>
                                - Kết quả có phân biệt có dấu và không dấu. Ví dụ:<span className="font-bold">&nbsp;nhan vien ban hang&nbsp;</span>và <span className="font-bold">&nbsp;Nhân viên bán
                                hàng&nbsp;</span> sẽ cho kết quả khác nhau.
                            </div>
                            <div>
                                - Kết quả không phân biệt viết hoa viết thường. Ví dụ: <span className="font-bold">&nbsp;nhân viên&nbsp;</span>và<span className="font-bold">&nbsp;Nhân viên&nbsp;</span>kết quả
                                giống nhau.
                            </div>
                            <div>- Các toán tử (AND / OR / NOT)cần viết in hoa hệ thống mới phân biệt được.</div>
                            <div>
                                - Với toán tử loại trừ, dấu "-" phải đặt sát với keyword cần search. Ví dụ:<span className="font-bold">&nbsp;-Nhân viên kinh doanh&nbsp;</span>là đúng, ngược lại<span className="font-bold">&nbsp;- Nhân viên kinh doanh&nbsp;</span>hệ thống không nhận diện được.
                            </div>
                            <div>
                                - Tên các field phổ biến search theo trường hợp 7: name, mail, mobile, address, title, birthday, salary,...
                            </div>
                        </div>
                        <div className="mt10 text-italic">
                            <div className="text-underline font-bold">
                                Các trường hợp đặc biệt:
                            </div>
                            <div>
                                {`+ Custom salary: salary: (>5000000 AND <6000000)`}
                            </div>
                            <div>+ Search *: account*, admin*, market*,...</div>
                            <div>{`+ Birthday:  >1990-01-01 AND <1994-01-01`}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default DocumentPopup;
