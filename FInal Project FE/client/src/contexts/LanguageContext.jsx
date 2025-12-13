import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    en: {
        nav: {
            home: "Home",
            properties: "Properties",
            about: "About Us",
            contact: "Contact",
            postAd: "POST AD",
            login: "Login",
            register: "Register"
        },
        hero: {
            title: "Find Your Boarding Place",
            subtitle: "The Most Trustworthy Boarding Place Platform in Sri Lanka",
            location: "LOCATION",
            province: "Province",
            district: "Result District",
            propertyType: "PROPERTY TYPE",
            allTypes: "All Types",
            singleRoom: "Single Room",
            sharedRoom: "Shared Room",
            clientType: "CLIENT TYPE",
            select: "Select",
            gender: {
                girls: "For Girls",
                boys: "For Boys",
                couples: "For Couples",
                family: "For Family"
            },
            maxPrice: "MAX PRICE",
            anyPrice: "Any Price",
            searchBtn: "SEARCH NOW"
        },
        welcome: {
            title: "Welcome to Ceylon Stay",
            sub: "The Most Trustworthy Boarding Place Platform in Sri Lanka",
            desc: "Ceylon Stay is a digital platform designed for making fast and easy connections between boarding place owners and tenants in Sri Lanka. We focus on listing available boarding places, accessing and finding boarding places anywhere and anytime developed by team The Dark Code.",
            verified: "Verified Listings",
            fast: "Fast Connections"
        },
        listings: {
            title: "Find Your Perfect Place",
            subtitle: "Browse through our verified listings",
            filters: "Filters",
            facilities: "Facilities",
            apply: "Apply Filters",
            showing: "Showing",
            results: "results",
            sort: "Sort by",
            newest: "Newest",
            priceLow: "Price: Low to High",
            priceHigh: "Price: High to Low",
            viewDetails: "View Details",
            beds: "Beds",
            bath: "Bath",
            shared: "Shared",
            kitchen: "Kitchen",
            ac: "AC"
        },
        property: {
            breadcrumb: {
                home: "Home",
                find: "Find a Place"
            },
            perMonth: "per month",
            description: "Description",
            facilities: "Facilities",
            location: "Location",
            contactOwner: "Contact Owner",
            memberSince: "Member since",
            showPhone: "Show Phone Number",
            sendMessage: "Send Message",
            safety: "Safety Tips",
            safety1: "Don't pay before visiting the place.",
            safety2: "Meet the owner in person.",
            safety3: "Check all facilities before paying."
        },
        auth: {
            loginTitle: "Ceylon Stay",
            loginWelcome: "Welcome back! Please login to your account.",
            registerTitle: "Ceylon Stay",
            registerSubtitle: "Create an account to get started.",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email Address",
            password: "Password",
            remember: "Remember me",
            forgot: "Forgot Password?",
            loginBtn: "Login",
            noAccount: "Don't have an account?",
            registerLink: "Register",
            roleLabel: "I am a...",
            tenant: "Tenant",
            owner: "Owner",
            terms: "I agree to the Terms of Service and Privacy Policy",
            createAccount: "Create Account",
            haveAccount: "Already have an account?",
            loginLink: "Login"
        },
        footer: {
            desc: "The most trustworthy platform for finding boarding places in Sri Lanka. Fast, easy, and secure connections between owners and tenants.",
            quickLinks: "QUICK LINKS",
            support: "SUPPORT",
            help: "Help Center",
            terms: "Terms of Use",
            privacy: "Privacy Policy",
            faqs: "FAQs",
            contact: "CONTACT US",
            subscribe: "SUBSCRIBE TO NEWSLETTER",
            emailPlace: "Email Address",
            copyright: "2023 Ceylon Stay. All Rights Reserved. Designed for Excellence."
        }
    },
    si: {
        nav: {
            home: "මුල් පිටුව",
            properties: "දේපල",
            about: "අපි ගැන",
            contact: "සම්බන්ධ වන්න",
            postAd: "දැන්වීමක් පළ කරන්න",
            login: "ඇතුල් වන්න",
            register: "ලියාපදිංචි වන්න"
        },
        hero: {
            title: "ඔබේ නවාතැන සොයා ගන්න",
            subtitle: "ශ්‍රී ලංකාවේ වඩාත්ම විශ්වාසවන්ත නවාතැන් වේදිකාව",
            location: "ස්ථානය",
            province: "පළාත",
            district: "දිස්ත්‍රික්කය",
            propertyType: "දේපල වර්ගය",
            allTypes: "සියලු වර්ග",
            singleRoom: "තනි කාමරය",
            sharedRoom: "හවුල් කාමරය",
            clientType: "පාරිභෝගික වර්ගය",
            select: "තෝරන්න",
            gender: {
                girls: "ගැහැණු ළමුන් සඳහා",
                boys: "පිරිමි ළමුන් සඳහා",
                couples: "යුවළයන් සඳහා",
                family: "පවුල් සඳහා"
            },
            maxPrice: "උපරිම මිල",
            anyPrice: "ඕනෑම මිලක්",
            searchBtn: "දැන් සොයන්න"
        },
        welcome: {
            title: "Ceylon Stay වෙත සාදරයෙන් පිළිගනිමු",
            sub: "ශ්‍රී ලංකාවේ වඩාත්ම විශ්වාසවන්ත නවාතැන් වේදිකාව",
            desc: "Ceylon Stay යනු ශ්‍රී ලංකාවේ නවාතැන් හිමිකරුවන් සහ කුලී නිවැසියන් අතර වේගවත් හා පහසු සම්බන්ධතාවයක් ඇති කිරීම සඳහා නිර්මාණය කර ඇති ඩිජිටල් වේදිකාවකි. ඕනෑම තැනක සහ ඕනෑම වේලාවක නවාතැන් සොයා ගැනීම අපගේ අරමුණයි. The Dark Code කණ්ඩායම විසින් වැඩි දියුණු කරන ලදී.",
            verified: "තහවුරු කළ ලැයිස්තුගත කිරීම්",
            fast: "වේගවත් සම්බන්ධතා"
        },
        listings: {
            title: "ඔබේ පරිපූර්ණ ස්ථානය සොයා ගන්න",
            subtitle: "අපගේ තහවුරු කළ ලැයිස්තුගත කිරීම් හරහා පිරික්සන්න",
            filters: "පෙරහන්",
            facilities: "පහසුකම්",
            apply: "පෙරහන් යොදන්න",
            showing: "පෙන්වමින් පවතී",
            results: "ප්‍රතිඵල",
            sort: "පිළිවෙල",
            newest: "නව",
            priceLow: "මිල: අඩු සිට වැඩි",
            priceHigh: "මිල: වැඩි සිට අඩු",
            viewDetails: "විස්තර බලන්න",
            beds: "ඇඳන්",
            bath: "නානකාමර",
            shared: "හවුල්",
            kitchen: "මුළුතැන්ගෙය",
            ac: "වායුසමීකරණ"
        },
        property: {
            breadcrumb: {
                home: "මුල් පිටුව",
                find: "ස්ථානයක් සොයන්න"
            },
            perMonth: "මසකට",
            description: "විස්තරය",
            facilities: "පහසුකම්",
            location: "ස්ථානය",
            contactOwner: "හිමිකරු අමතන්න",
            memberSince: "සාමාජිකත්වය",
            showPhone: "දුරකථන අංකය පෙන්වන්න",
            sendMessage: "පණිවිඩයක් යවන්න",
            safety: "ආරක්ෂක උපදෙස්",
            safety1: "ස්ථානය බැලීමට පෙර මුදල් ගෙවන්න එපා.",
            safety2: "හිමිකරු පෞද්ගලිකව හමුවන්න.",
            safety3: "ගෙවීමට පෙර සියලු පහසුකම් පරීක්ෂා කරන්න."
        },
        auth: {
            loginTitle: "Ceylon Stay",
            loginWelcome: "නැවත සාදරයෙන් පිළිගනිමු! කරුණාකර ඔබේ ගිණුමට ඇතුල් වන්න.",
            registerTitle: "Ceylon Stay",
            registerSubtitle: "ආරම්භ කිරීමට ගිණුමක් සාදන්න.",
            firstName: "මුල් නම",
            lastName: "වාසගම",
            email: "විද්‍යුත් තැපෑල",
            password: "මුරපදය",
            remember: "මාව මතක තබා ගන්න",
            forgot: "මුරපදය අමතකද?",
            loginBtn: "ඇතුල් වන්න",
            noAccount: "ගිණුමක් නැද්ද?",
            registerLink: "ලියාපදිංචි වන්න",
            roleLabel: "මම...",
            tenant: "කුලී නිවැසියෙක්",
            owner: "හිමිකරුවෙක්",
            terms: "සේවා කොන්දේසි සහ රහස්‍යතා ප්‍රතිපත්තියට මම එකඟ වෙමි",
            createAccount: "ගිණුම සාදන්න",
            haveAccount: "දැනටමත් ගිණුමක් තිබේද?",
            loginLink: "ඇතුල් වන්න"
        },
        footer: {
            desc: "ශ්‍රී ලංකාවේ නවාතැන් සොයා ගැනීම සඳහා වඩාත්ම විශ්වාසවන්ත වේදිකාව. හිමිකරුවන් සහ කුලී නිවැසියන් අතර වේගවත්, පහසු සහ ආරක්ෂිත සම්බන්ධතා.",
            quickLinks: "ක්ෂණික සබැඳි",
            support: "සහාය",
            help: "උදව් මධ්‍යස්ථානය",
            terms: "භාවිත කොන්දේසි",
            privacy: "රහස්‍යතා ප්‍රතිපත්තිය",
            faqs: "නිතර අසන පැන",
            contact: "අප අමතන්න",
            subscribe: "පුවත් පත්‍රිකාවට දායක වන්න",
            emailPlace: "විද්‍යුත් තැපෑල",
            copyright: "2023 Ceylon Stay. සියලු හිමිකම් ඇවිරිණි."
        }
    },
    ta: {
        nav: {
            home: "முகப்பு",
            properties: "சொத்துக்கள்",
            about: "எங்களை பற்றி",
            contact: "தொடர்பு",
            postAd: "விளம்பரம்",
            login: "உள்நுழைய",
            register: "பதிவு"
        },
        hero: {
            title: "உங்கள் தங்குமிடத்தைக் கண்டறியவும்",
            subtitle: "இலங்கையின் மிகவும் நம்பகமான தங்குமிட தளம்",
            location: "இடம்",
            province: "மாகாணம்",
            district: "மாவட்டம்",
            propertyType: "சொத்து வகை",
            allTypes: "அனைத்து வகைகள்",
            singleRoom: "தனி அறை",
            sharedRoom: "பகிர்வு அறை",
            clientType: "வாடிக்கையாளர் வகை",
            select: "தேர்ந்தெடு",
            gender: {
                girls: "பெண்களுக்கு",
                boys: "ஆண்களுக்கு",
                couples: "தம்பதிகளுக்கு",
                family: "குடும்பத்திற்கு"
            },
            maxPrice: "அதிகபட்ச விலை",
            anyPrice: "எந்த விலையும்",
            searchBtn: "இப்போது தேடுங்கள்"
        },
        welcome: {
            title: "Ceylon Stay க்கு வரவேற்கிறோம்",
            sub: "இலங்கையின் மிகவும் நம்பகமான தங்குமிட தளம்",
            desc: "Ceylon Stay என்பது இலங்கையில் தங்குமிட உரிமையாளர்களுக்கும் வாடகைதாரர்களுக்கும் இடையே விரைவான மற்றும் எளிதான தொடர்புகளை ஏற்படுத்துவதற்காக வடிவமைக்கப்பட்ட ஒரு டிஜிட்டல் தளமாகும். The Dark Code குழுவால் உருவாக்கப்பட்டது.",
            verified: "சரிபார்க்கப்பட்ட பட்டியல்கள்",
            fast: "வேகமான இணைப்புகள்"
        },
        listings: {
            title: "உங்கள் சரியான இடத்தைக் கண்டறியவும்",
            subtitle: "எங்கள் சரிபார்க்கப்பட்ட பட்டியல்களை உலாவவும்",
            filters: "வடிப்பான்கள்",
            facilities: "வசதிகள்",
            apply: "விண்ணப்பிக்கவும்",
            showing: "காட்டுகிறது",
            results: "முடிவுகள்",
            sort: "வகைப்படுத்த",
            newest: "புதியது",
            priceLow: "விலை: குறைவானது முதல்",
            priceHigh: "விலை: அதிகமானது முதல்",
            viewDetails: "விவரங்களைப் பார்க்க",
            beds: "படுக்கைகள்",
            bath: "குளியலறை",
            shared: "பகிரப்பட்டது",
            kitchen: "சமையலறை",
            ac: "ஏசி"
        },
        property: {
            breadcrumb: {
                home: "முகப்பு",
                find: "இடத்தைக் கண்டுபிடி"
            },
            perMonth: "மாதத்திற்கு",
            description: "விளக்கம்",
            facilities: "வசதிகள்",
            location: "இடம்",
            contactOwner: "உரிமையாளரைத் தொடர்புகொள்ளவும்",
            memberSince: "உறுப்பினர்",
            showPhone: "தொலைபேசி எண்ணைக் காட்டு",
            sendMessage: "செய்தி அனுப்பவும்",
            safety: "பாதுகாப்பு குறிப்புகள்",
            safety1: "இடத்தைப் பார்ப்பதற்கு முன் பணம் செலுத்த வேண்டாம்.",
            safety2: "உரிமையாளரை நேரில் சந்திக்கவும்.",
            safety3: "பணம் செலுத்துவதற்கு முன் அனைத்து வசதிகளையும் சரிபார்க்கவும்."
        },
        auth: {
            loginTitle: "Ceylon Stay",
            loginWelcome: "மீண்டும் வருக! தயவுசெய்து உங்கள் கணக்கில் உள்நுழையவும்.",
            registerTitle: "Ceylon Stay",
            registerSubtitle: "தொடங்க ஒரு கணக்கை உருவாக்கவும்.",
            firstName: "முதல் பெயர்",
            lastName: "கடைசி பெயர்",
            email: "மின்னஞ்சல் முகவரி",
            password: "கடவுச்சொல்",
            remember: "என்னை நினைவில் கொள்",
            forgot: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
            loginBtn: "உள்நுழைய",
            noAccount: "கணக்கு இல்லையா?",
            registerLink: "பதிவு",
            roleLabel: "நான் ஒரு...",
            tenant: "வாடகைதாரர்",
            owner: "உரிமையாளர்",
            terms: "விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்",
            createAccount: "கணக்கை உருவாக்கவும்",
            haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
            loginLink: "உள்நுழைய"
        },
        footer: {
            desc: "இலங்கையில் தங்குமிடங்களைக் கண்டறிவதற்கான மிகவும் நம்பகமான தளம். உரிமையாளர்களுக்கும் வாடகைதாரர்களுக்கும் இடையே வேகமான, எளிதான மற்றும் பாதுகாப்பான இணைப்புகள்.",
            quickLinks: "விரைவான இணைப்புகள்",
            support: "ஆதரவு",
            help: "உதவி மையம்",
            terms: "பயன்பாட்டு விதிமுறைகள்",
            privacy: "தனியுரிமைக் கொள்கை",
            faqs: "கேள்விகள்",
            contact: "எங்களை தொடர்பு கொள்ள",
            subscribe: "செய்திமடலுக்கு குழுசேரவும்",
            emailPlace: "மின்னஞ்சல் முகவரி",
            copyright: "2023 Ceylon Stay. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language];
        for (let key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
