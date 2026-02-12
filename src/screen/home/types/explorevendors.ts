export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  location: string;
  image: string;
}

export const CATEGORIES = [
  "All",
  "Venues",
  "Catering",
  "Decoration",
  "Photography",
  "Planners",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const VENDORS: Vendor[] = [
  {
    id: "1",
    name: "Royal Palace Weddings",
    category: "Venue",
    rating: 4.9,
    reviews: 120,
    priceLevel: "$$$$",
    location: "Manhattan, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
  },
  {
    id: "2",
    name: "Aperture Photography",
    category: "Photography",
    rating: 4.7,
    reviews: 85,
    priceLevel: "$$",
    location: "Brooklyn, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
  },
  {
    id: "3",
    name: "Elegant Eats Catering",
    category: "Catering",
    rating: 4.8,
    reviews: 200,
    priceLevel: "$$$",
    location: "Queens, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVZMXfDTrga8zlthrkGcE34uboSRvgDDcGLV4Zv05QfinRcbOcUhO7YxzJDSKoasGHbtFJH0UmnkG8X8UON89yrr6V4bGUfBVQlAUS3Yvl2ry003gX7zVTFcr8MpyGdQXOYELOepoGOdh8Co7cqFq4Pp9hITgiHCiyZ6sxn0oZ__JPXGJPDdNxtso9fIuDKFION8HWjPQK1EfcvmqcaD60ubDeRI4zSm4eUtGseLOtbvMSimHsbEAShXSiIUlQJY1YnUx6R2XOtY",
  },
  {
    id: "4",
    name: "Bloom & Wild Decor",
    category: "Decoration",
    rating: 4.9,
    reviews: 45,
    priceLevel: "$$$",
    location: "Staten Island, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9La7FaYaWmrN3p7F2OnkUEEwBPZHRiGNa7O46CpMyG62MzfxvYlSK5kE_VKyRKEqJhBDU1Wy6bNK6rno2gVVpRDIxz0TfrfW1A8hJXZR7FVCjXQnJfqlt0bj7UhUByiHYI7Z90787lDMRIONhA-L1L5szOoK0YeoJSsHXzQX39EOUB-MXXPmSA8fxVyYQOeGZovNXJOCypE58rcE7nlTZlzbu3b_PM7LujfCuclSYkKNLqsHyo3wstxyWxmKbYqVyBwffkx2uF0",
  },
];

export const PINK_PRIMARY = "#ee2b8c";
