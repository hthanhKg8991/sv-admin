export const getError = () => {
    return {
        'Thông tin là bắt buộc':'Information is required',
        'E-mail phải đúng định dạng':'E-mail must be in the correct format',
        'Số điện thoại liên hệ tối đa 11 số.':'Phone number up to 11 numbers.',
        ':attr_name phải lớn hơn ngày ghi nhận phiếu.':'The validity period must be greater than the date of receipt of the ballot.',
        ':attr_name không hợp lệ.':':attr_name invalid.',
        'Trường :attr_name có giá trị tối thiểu là 1000':'Field :attr_name has a minimum value of 1000',
        ':attr_name phải lớn hơn thời gian hiệu lực của gói phí.': 'The validity period must be greater than the validity period of the charge package.',
        ':attr_name phải nhỏ hơn TG DV gói phí.': ':attr_name phải nhỏ hơn TG DV gói phí.',
    };
};
