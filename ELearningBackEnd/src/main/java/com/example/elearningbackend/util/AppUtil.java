package com.example.elearningbackend.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class AppUtil {

    public static String toSlug(String input) {
        String slug = input.toLowerCase();

        slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
        slug = slug.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        slug = slug.replaceAll("[^\\w\\s-]", "").trim().replaceAll("\\s+", "-");
        return slug;
    }

    public static String removeAccentAndSpaces(String s) {
        // Thay thế các ký tự đặc biệt tiếng Việt
        s = s.replace("Đ", "D").replace("đ", "d");

        // Chuẩn hóa chuỗi theo định dạng Unicode NFC
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);

        // Loại bỏ các ký tự không phải ASCII (bao gồm dấu)
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noAccent = pattern.matcher(temp).replaceAll("");

        // Loại bỏ tất cả các ký tự không phải chữ cái hoặc số
        noAccent = noAccent.replaceAll("[^a-zA-Z0-9]", ""); // Giữ lại chữ cái và số

        return noAccent;
    }
}
