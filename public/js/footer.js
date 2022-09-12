const createFooter = () => {
    let footer = document.querySelector("footer");

    footer.innerHTML = `
        <div class="footer-content">
                <img src="../img/light-logo.png" alt="" class="logo" />
                <div class="footer-ul-container">
                    <!-- men -->

                    <ul class="category">
                        <li class="category-title">men</li>
                        <li><a href="#" class="footer-link">sweatshirts</a></li>
                        <li><a href="#" class="footer-link">shirts</a></li>
                        <li><a href="#" class="footer-link">jeans</a></li>
                        <li><a href="#" class="footer-link">trousers</a></li>
                        <li><a href="#" class="footer-link">shorts</a></li>
                        <li><a href="#" class="footer-link">casuals</a></li>
                        <li><a href="#" class="footer-link">formals</a></li>
                        <li><a href="#" class="footer-link">sports</a></li>
                        <li><a href="#" class="footer-link">watch</a></li>
                    </ul>
                    <!-- men -->

                    <!-- women -->
                    <ul class="category">
                        <li class="category-title">women</li>
                        <li><a href="#" class="footer-link">sweatshirts</a></li>
                        <li><a href="#" class="footer-link">shirts</a></li>
                        <li><a href="#" class="footer-link">jeans</a></li>
                        <li><a href="#" class="footer-link">trousers</a></li>
                        <li><a href="#" class="footer-link">shorts</a></li>
                        <li><a href="#" class="footer-link">casuals</a></li>
                        <li><a href="#" class="footer-link">formals</a></li>
                        <li><a href="#" class="footer-link">sports</a></li>
                        <li><a href="#" class="footer-link">watch</a></li>
                    </ul>

                    <!-- women -->
                </div>
            </div>

            <p class="footer-title">about company</p>
            <p class="info">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatibus dicta laborum, aliquam officia culpa reprehenderit,
                ipsum, non incidunt delectus accusamus accusantium! Assumenda
                incidunt ipsum beatae sunt modi laudantium, in ab?
            </p>
            <p class="info">support email - help@clothing.com</p>
            <p class="info">telephone - 180 00 00 001, 1800 00 00 002</p>
            <div class="footer-social-container">
                <div>
                    <a href="#" class="social-link">terms & services</a>
                    <a href="#" class="social-link">privacy page</a>
                </div>

                <div>
                    <a href="#" class="social-link">instagram</a>
                    <a href="#" class="social-link">facebook</a>
                </div>
            </div>

            <p class="footer-credit">Clothing, Best apparels online Stores</p>
    `;
};

createFooter();
