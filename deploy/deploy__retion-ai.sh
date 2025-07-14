#!/bin/bash

# build code ở path /chat
pnpm build-sub-path

# di chuyển đến thư mục chứa code build
cd ../retion__landing-page

# lấy code mới nhất
git pull

# xóa thư mục chat cũ
rm -rf public/chat

# về thư mục chứa code build
cd -

# di chuyển code build vào thư mục public/chat
mv dist ../retion__landing-page/public/chat

# di chuyển đến thư mục chứa code build
cd ../retion__landing-page

# commit code mới
git add .
git commit -m 'update chat'
git push