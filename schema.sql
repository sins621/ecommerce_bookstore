CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100)
);

CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    street_address TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    spatial_location TEXT,
    country_id INTEGER REFERENCES countries(country_id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role INTEGER,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    display_name VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users_roles (
    user_id INTEGER REFERENCES users(user_id),
    role_id INTEGER REFERENCES roles(role_id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE users_addresses (
    user_id INTEGER REFERENCES users(user_id),
    address_id INTEGER REFERENCES addresses(address_id),
    is_default BOOLEAN,
    PRIMARY KEY (user_id, address_id)
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT,
    author TEXT,
    publish_year SMALLINT,
    abstract TEXT,
    cover TEXT,
    quantity INTEGER,
    price NUMERIC(15, 5),
    isbn VARCHAR(20) UNIQUE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    image_link VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE books_categories (
    book_id INTEGER REFERENCES books(book_id),
    category_id INTEGER REFERENCES categories(category_id),
    PRIMARY KEY (book_id, category_id)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    order_type INTEGER,
    status INTEGER,
    payment_status INTEGER,
    delivery_method VARCHAR(100),
    subtotal NUMERIC(15, 5),
    vat NUMERIC(15, 5),
    total_incl_vat NUMERIC(15, 5),
    total_excl_vat NUMERIC(15, 5),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE orders_items (
    order_id INTEGER REFERENCES orders(order_id),
    book_id INTEGER REFERENCES books(book_id),
    quantity INTEGER,
    price NUMERIC(15, 5),
    vat NUMERIC(15, 5),
    total NUMERIC(15, 5),
    PRIMARY KEY (order_id, book_id)
);

CREATE TABLE promotions (
    promotion_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type TEXT CHECK (type IN ('fixed', 'percentage')),
    discount_value NUMERIC(10, 2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    banner_link VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE promotion_books (
    promotion_id INTEGER REFERENCES promotions(promotion_id),
    book_id INTEGER REFERENCES books(book_id),
    PRIMARY KEY (promotion_id, book_id)
);

CREATE TABLE promotion_categories (
    promotion_id INTEGER REFERENCES promotions(promotion_id),
    category_id INTEGER REFERENCES categories(category_id),
    PRIMARY KEY (promotion_id, category_id)
);

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(email),
    sale_date DATE,
    sold_on DATE
);

CREATE TABLE sales_items (
    sale_id INTEGER REFERENCES sales(sale_id),
    book_id INTEGER REFERENCES books(book_id),
    quantity INTEGER,
    book_isbn VARCHAR(20) REFERENCES books(isbn),
    price NUMERIC(15, 5),
    PRIMARY KEY (sale_id, book_id)
);

CREATE TABLE books_reviews (
    review_id SERIAL PRIMARY KEY,
    review_title TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    review_text TEXT,
    user_id INTEGER REFERENCES users(user_id),
    review_rating INTEGER,
    book_id INTEGER REFERENCES books(book_id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    event TEXT,
    object TEXT,
    description TEXT,
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

CREATE TABLE adverts (
    advert_id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    alt_text TEXT,
    placement VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_items_order_id ON orders_items (order_id);
CREATE INDEX idx_orders_items_book_id ON orders_items (book_id);
CREATE INDEX idx_books_isbn ON books (isbn);
CREATE INDEX idx_categories_name ON categories (name);
CREATE INDEX idx_countries_country_name ON countries (country_name);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_sales_user_email ON sales (user_email);
CREATE INDEX idx_sales_items_sale_id ON sales_items (sale_id);
CREATE INDEX idx_sales_items_book_id ON sales_items (book_id);
CREATE INDEX idx_books_reviews_user_id ON books_reviews (user_id);
CREATE INDEX idx_books_reviews_book_id ON books_reviews (book_id);
CREATE INDEX idx_promotion_books_promotion_id ON promotion_books (promotion_id);
CREATE INDEX idx_promotion_books_book_id ON promotion_books (book_id);
CREATE INDEX idx_promotion_categories_promotion_id ON promotion_categories (promotion_id);
CREATE INDEX idx_promotion_categories_category_id ON promotion_categories (category_id);
CREATE INDEX idx_users_roles_user_id ON users_roles (user_id);
CREATE INDEX idx_users_roles_role_id ON users_roles (role_id);
CREATE INDEX idx_users_addresses_user_id ON users_addresses (user_id);
CREATE INDEX idx_users_addresses_address_id ON users_addresses (address_id);
CREATE INDEX idx_books_categories_book_id ON books_categories (book_id);
CREATE INDEX idx_books_categories_category_id ON books_categories (category_id);
