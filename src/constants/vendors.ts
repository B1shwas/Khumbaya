export type OnboardingVendor = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  location: string;
  image: string;
  // Detail page fields
  headerImage: string;
  avatar: string;
  description: string;
  tags: string[];
  gallery: string[];
  packages: {
    title: string;
    price: string;
    description: string;
    badge?: string;
  }[];
  detailReviews: {
    name: string;
    time: string;
    rating: number;
    text: string;
    avatar: string;
  }[];
};

export const ONBOARDING_VENDORS: OnboardingVendor[] = [
  {
    id: "1",
    name: "Royal Palace Weddings",
    category: "Venues",
    rating: 4.9,
    reviews: 120,
    priceLevel: "$$$$",
    location: "Manhattan, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIWVyUn7mizRXt-pU0k_RKFdAfNF_d21mLZuL6fE-z88oUHVipXSGUhNmA5WfOISIeb5QApM1WV-MqiArQgJejxYGuerwubu6lcVkwkED06qEDLGBM7Xqz0ISW7b9rPn7S5ZW1hwAZxyVJLtwp0mkKKpGBUzYThC2D9AsRi-INlhoD8olL86wNyceuSQjvSCGLvlkuKEaRRpvGNa3ooDKEzBTa-g2eoD-4QuvwrSjC7f8_Nwv5Gm18EKFeYf5rKFnpg1QNMlLOq18",
    description:
      "Manhattan's most prestigious wedding venue for over 15 years. Our grand ballrooms and rooftop terraces accommodate 50–500 guests, with in-house catering, lighting, and a dedicated event coordinator to bring your dream wedding to life.",
    tags: ["Reception", "Ceremony", "Sangeet", "Mehndi", "Cocktail Hour"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpp51MGdcz2CaS_-F_SFIuK3aVZ7OXvsVVPqCvX7ehi1wfAm0fu52s3HOa5lTBmal9m9zwFDRL7eWZLoAQtcVWnYGLr4BmuBovXDqMNoqp-fmiQaw7P7Qby6ftrwPBK-2bQQDjvHk6viUHa1utnrhN8z88x3-BmmzDvd9_O59ZQtyCjRNNgX1yF6iLvPi9IiGmPwoIRnt48r8eoTfOwqfJkgeHrhNcdWgDX74rELXlJaXEI5CrgqS-VACXj2LzM7xIQ4KP311BeaI",
    ],
    packages: [
      {
        title: "Silver Ballroom",
        price: "$5,000",
        description:
          "Half-day rental (6 hrs), up to 150 guests, basic décor, and in-house catering.",
      },
      {
        title: "Grand Royal Package",
        price: "$12,000",
        description:
          "Full-day rental, up to 500 guests, premium décor, open bar, and dedicated coordinator.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Anika S.",
        time: "1 week ago",
        rating: 5,
        text: "The venue was absolutely breathtaking. Our guests couldn't stop talking about the grand chandeliers!",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Dev P.",
        time: "3 weeks ago",
        rating: 5,
        text: "The coordinator handled everything perfectly. Truly a 5-star experience from start to finish.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
  {
    id: "2",
    name: "Aperture Photography",
    category: "Photographers",
    rating: 4.7,
    reviews: 85,
    priceLevel: "$$",
    location: "Brooklyn, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
    description:
      "Capturing the soul of Indian weddings for over 10 years. We specialize in candid moments and traditional rituals, ensuring your memories last forever. Our Brooklyn-based team travels across the tri-state area.",
    tags: ["Mehndi", "Sangeet", "Nikah", "Pre-Wedding"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpp51MGdcz2CaS_-F_SFIuK3aVZ7OXvsVVPqCvX7ehi1wfAm0fu52s3HOa5lTBmal9m9zwFDRL7eWZLoAQtcVWnYGLr4BmuBovXDqMNoqp-fmiQaw7P7Qby6ftrwPBK-2bQQDjvHk6viUHa1utnrhN8z88x3-BmmzDvd9_O59ZQtyCjRNNgX1yF6iLvPi9IiGmPwoIRnt48r8eoTfOwqfJkgeHrhNcdWgDX74rELXnJaXEI5CrgqS-VACXj2LzM7xIQ4KP311BeaI",
    ],
    packages: [
      {
        title: "Pre-Wedding Shoot",
        price: "$500",
        description:
          "4-hour session, 2 locations, 50 edited photos, and 1 highlight reel.",
      },
      {
        title: "Full Wedding Day",
        price: "$2,500",
        description:
          "12-hour coverage, candid & traditional, 500+ photos, full cinematic film.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Priya K.",
        time: "2 weeks ago",
        rating: 5,
        text: "Absolutely stunning photos! The team was so patient during the chaos of the Sangeet. Highly recommend!",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Rahul M.",
        time: "1 month ago",
        rating: 4,
        text: "Great experience overall. The traditional shots were perfect, though candid shots could be better.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
  {
    id: "3",
    name: "Elegant Eats Catering",
    category: "Food",
    rating: 4.8,
    reviews: 200,
    priceLevel: "$$$",
    location: "Queens, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVZMXfDTrga8zlthrkGcE34uboSRvgDDcGLV4Zv05QfinRcbOcUhO7YxzJDSKoasGHbtFJH0UmnkG8X8UON89yrr6V4bGUfBVQlAUS3Yvl2ry003gX7zVTFcr8MpyGdQXOYELOepoGOdh8Co7cqFq4Pp9hITgiHCiyZ6sxn0oZ__JPXGJPDdNxtso9fIuDKFION8HWjPQK1EfcvmqcaD60ubDeRI4zSm4eUtGseLOtbvMSimHsbEAShXSiIUlQJY1YnUx6R2XOtY",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVZMXfDTrga8zlthrkGcE34uboSRvgDDcGLV4Zv05QfinRcbOcUhO7YxzJDSKoasGHbtFJH0UmnkG8X8UON89yrr6V4bGUfBVQlAUS3Yvl2ry003gX7zVTFcr8MpyGdQXOYELOepoGOdh8Co7cqFq4Pp9hITgiHCiyZ6sxn0oZ__JPXGJPDdNxtso9fIuDKFION8HWjPQK1EfcvmqcaD60ubDeRI4zSm4eUtGseLOtbvMSimHsbEAShXSiIUlQJY1YnUx6R2XOtY",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
    description:
      "Queens' premier South Asian wedding caterers. We craft authentic Indian, Pakistani, and fusion menus for intimate gatherings and grand celebrations alike. Our chefs bring 20+ years of culinary tradition to every event.",
    tags: ["Baraat Brunch", "Mehndi Feast", "Wedding Dinner", "Cocktail Bites"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVZMXfDTrga8zlthrkGcE34uboSRvgDDcGLV4Zv05QfinRcbOcUhO7YxzJDSKoasGHbtFJH0UmnkG8X8UON89yrr6V4bGUfBVQlAUS3Yvl2ry003gX7zVTFcr8MpyGdQXOYELOepoGOdh8Co7cqFq4Pp9hITgiHCiyZ6sxn0oZ__JPXGJPDdNxtso9fIuDKFION8HWjPQK1EfcvmqcaD60ubDeRI4zSm4eUtGseLOtbvMSimHsbEAShXSiIUlQJY1YnUx6R2XOtY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
    ],
    packages: [
      {
        title: "Intimate Gathering",
        price: "$1,800",
        description:
          "Up to 50 guests, 3-course menu, live chaat station, and service staff.",
      },
      {
        title: "Grand Feast",
        price: "$6,500",
        description:
          "Up to 300 guests, full buffet with 12 dishes, dessert bar, and chai station.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Meera T.",
        time: "3 days ago",
        rating: 5,
        text: "The biryani was legendary! Every single guest asked for the recipe. Will definitely book again.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Omar K.",
        time: "2 weeks ago",
        rating: 5,
        text: "Flawless service and incredible food. The live chaat counter was a huge hit at our Mehndi.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
  {
    id: "4",
    name: "Bloom & Wild Decor",
    category: "Planning & Decor",
    rating: 4.9,
    reviews: 45,
    priceLevel: "$$$",
    location: "Staten Island, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9La7FaYaWmrN3p7F2OnkUEEwBPZHRiGNa7O46CpMyG62MzfxvYlSK5kE_VKyRKEqJhBDU1Wy6bNK6rno2gVVpRDIxz0TfrfW1A8hJXZR7FVCjXQnJfqlt0bj7UhUByiHYI7Z90787lDMRIONhA-L1L5szOoK0YeoJSsHXzQX39EOUB-MXXPmSA8fxVyYQOeGZovNXJOCypE58rcE7nlTZlzbu3b_PM7LujfCuclSYkKNLqsHyo3wstxyWxmKbYqVyBwffkx2uF0",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9La7FaYaWmrN3p7F2OnkUEEwBPZHRiGNa7O46CpMyG62MzfxvYlSK5kE_VKyRKEqJhBDU1Wy6bNK6rno2gVVpRDIxz0TfrfW1A8hJXZR7FVCjXQnJfqlt0bj7UhUByiHYI7Z90787lDMRIONhA-L1L5szOoK0YeoJSsHXzQX39EOUB-MXXPmSA8fxVyYQOeGZovNXJOCypE58rcE7nlTZlzbu3b_PM7LujfCuclSYkKNLqsHyo3wstxyWxmKbYqVyBwffkx2uF0",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIWVyUn7mizRXt-pU0k_RKFdAfNF_d21mLZuL6fE-z88oUHVipXSGUhNmA5WfOISIeb5QApM1WV-MqiArQgJejxYGuerwubu6lcVkwkED06qEDLGBM7Xqz0ISW7b9rPn7S5ZW1hwAZxyVJLtwp0mkKKpGBUzYThC2D9AsRi-INlhoD8olL86wNyceuSQjvSCGLvlkuKEaRRpvGNa3ooDKEzBTa-g2eoD-4QuvwrSjC7f8_Nwv5Gm18EKFeYf5rKFnpg1QNMlLOq18",
    description:
      "Staten Island's top floral and décor studio specializing in lush, romantic wedding designs. From intimate mandap setups to opulent reception tableaus, we turn every vision into a breathtaking reality.",
    tags: ["Mandap", "Reception", "Sangeet", "Floral Arrangements"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9La7FaYaWmrN3p7F2OnkUEEwBPZHRiGNa7O46CpMyG62MzfxvYlSK5kE_VKyRKEqJhBDU1Wy6bNK6rno2gVVpRDIxz0TfrfW1A8hJXZR7FVCjXQnJfqlt0bj7UhUByiHYI7Z90787lDMRIONhA-L1L5szOoK0YeoJSsHXzQX39EOUB-MXXPmSA8fxVyYQOeGZovNXJOCypE58rcE7nlTZlzbu3b_PM7LujfCuclSYkKNLqsHyo3wstxyWxmKbYqVyBwffkx2uF0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
    ],
    packages: [
      {
        title: "Floral Essentials",
        price: "$1,200",
        description:
          "Bridal bouquet, 10 centerpieces, and entrance floral arch.",
      },
      {
        title: "Full Wedding Décor",
        price: "$4,500",
        description:
          "Complete venue transformation: mandap, table décor, draping, lighting, and florals.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Nisha R.",
        time: "5 days ago",
        rating: 5,
        text: "The mandap was out of a dream. Every detail was thought through — guests were awestruck!",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Arjun D.",
        time: "1 month ago",
        rating: 4,
        text: "Beautiful work, very creative. Slight delay in setup but the final look was worth it.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
  {
    id: "5",
    name: "Radiant Bridal Makeup",
    category: "Makeup",
    rating: 4.8,
    reviews: 312,
    priceLevel: "$$$",
    location: "Hoboken, NJ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
    description:
      "Hoboken's most-booked bridal makeup artist team. We specialize in HD bridal, traditional airbrushed looks, and modern fusion styles. With 300+ brides served, we know how to make you glow on your special day.",
    tags: ["Bridal Makeup", "Mehndi Look", "Sangeet Glam", "Pre-Wedding"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
    ],
    packages: [
      {
        title: "Day-of Glam",
        price: "$350",
        description:
          "Bridal makeup only, HD finish, trial session included, on-site touch-up kit.",
      },
      {
        title: "Bridal Party Package",
        price: "$1,100",
        description:
          "Bride + 4 bridesmaids, all-day coverage across Mehndi, Sangeet & Wedding.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Sunita B.",
        time: "1 week ago",
        rating: 5,
        text: "I looked like a queen! The makeup lasted all night through all the crying and dancing.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Kavya N.",
        time: "3 weeks ago",
        rating: 5,
        text: "The artist understood exactly what I wanted. Such a calm and professional team!",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
  {
    id: "6",
    name: "BeatMakers DJ Crew",
    category: "Music & Dance",
    rating: 4.6,
    reviews: 98,
    priceLevel: "$$",
    location: "Newark, NJ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
    headerImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
    description:
      "Newark's hottest wedding DJ crew specializing in Bollywood, Bhangra, and fusion sets. We keep the dance floor packed from the first baraat beat to the last song of the night.",
    tags: ["Baraat", "Sangeet", "Reception", "Bollywood Night"],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
    ],
    packages: [
      {
        title: "Single Event",
        price: "$800",
        description:
          "4-hour DJ set, sound system, lighting rig, and MC services.",
      },
      {
        title: "Full Wedding Weekend",
        price: "$2,200",
        description:
          "Covers Mehndi, Sangeet & Reception — custom playlists for each event.",
        badge: "POPULAR",
      },
    ],
    detailReviews: [
      {
        name: "Vikram S.",
        time: "2 weeks ago",
        rating: 5,
        text: "The dance floor was packed all night! BeatMakers knew exactly when to switch from classics to bangers.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
      },
      {
        name: "Simran A.",
        time: "1 month ago",
        rating: 4,
        text: "Amazing energy! Would have liked a bit more variety in slow songs, but overall great experience.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
      },
    ],
  },
];
