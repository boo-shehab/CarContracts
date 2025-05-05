import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    "يرجى إدخال بريد إلكتروني صالح مثل example@domain.com"
  ),
  password: yup.string().required("كلمة السر مطلوبة").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم على الأقل"
  ).min(6, "كلمة السر يجب أن تكون 6 أحرف على الأقل")
});