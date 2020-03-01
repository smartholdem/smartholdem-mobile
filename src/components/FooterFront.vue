<template>
<div>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4 pt-5 text-left">
          <h4 class="font-weight-bolder"><i class="tim-icons icon-chat-33"></i> Community</h4>
          <ul style="list-style-type: none;">
            <li><a class="font-weight-bold color-gold" href="https://community.smartholdem.io"><i
              class="tim-icons icon-chat-33"></i> Forum </a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://t.me/smartholdem/"><i
              class="fab fa-telegram-plane"></i> Telegram</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://twitter.com/smartholdem"><i
              class="fab fa-twitter"></i> Twitter</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://twitter.com/dexgamesnet"><i
              class="fab fa-twitter"></i> Twitter 2</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold"
                   href="https://www.youtube.com/channel/UC5m98uMBjEQeFSfKag8X4-Q"><i class="fab fa-youtube"></i>
              YouTube</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold"
                   href="https://bitcointalk.org/index.php?topic=2169457.0"><i class="fab fa-bitcoin"></i>
              BitcoinTalk</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://www.instagram.com/smartholdem/"><i
              class="fab fa-instagram"></i> Instagram</a></li>
            <li><a class="font-weight-bold color-gold" target="_blank" href="mailto:contact@smartholdem.io"><i
              class="far fa-envelope"></i> contact@smartholdem.io</a></li>
          </ul>
        </div>

        <div class="col-md-4 pt-5 text-left">
          <h4 class="font-weight-bolder"><i class="tim-icons icon-book-bookmark"></i> Resources</h4>
          <ul>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://blockexplorer.smartholdem.io/">BlockExplorer</a>
            </li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://github.com/smartholdem">GitHub</a>
            </li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://api.smartholdem.io/">API</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://dexgames.net">DEX Games</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://onlinewallet.smartholdem.io/">Online
              Wallet</a></li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://faucet.smartholdem.io/">Faucet</a>
            </li>
            <li><a target="_blank" class="font-weight-bold color-gold" href="https://ex.xbts.io">DEX Exchange</a></li>
          </ul>
        </div>

        <div class="col-md-4 pt-5 text-left">
          <h4 class="font-weight-bolder"><i class="tim-icons icon-paper"></i> Legal</h4>
          <ul>
            <li>
              <router-link to="/legal-limitations" class="font-weight-bold color-gold"> Disclaimers and Limitation of
                Liability
              </router-link>
            </li>
            <li>
              <router-link to="/legal-terms" class="font-weight-bold color-gold"> Terms and Conditions</router-link>
            </li>
            <li>
              <router-link to="/legal-warranties" class="font-weight-bold color-gold"> Disclaimer of Warranties
              </router-link>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div class="text-center mt-5">
      <p class="text-center color-brown">&copy; 2017 - {{ year }}, powered by SmartHoldem</p>
      <p class="text-center color-brown">All trademarks & copyrights belong to their owners</p>
    </div>


    <!--
    <div class="container-fluid">
      <nav>
        <ul class="nav">

          <li class="nav-item">
            <a
              href="https://community.smartholdem.io/"
              target="_blank"
              rel="noopener"
              class="nav-link"
            >

            </a>
          </li>

          <li class="nav-item">
            <a
              href="https://community.smartholdem.io/"
              target="_blank"
              rel="noopener"
              class="nav-link"
            >

            </a>
          </li>

          <li class="nav-item">
            <a
              href="https://community.smartholdem.io/"
              target="_blank"
              rel="noopener"
              class="nav-link"
            >

            </a>
          </li>

        </ul>
      </nav>
      <div class="copyright">
        &copy; 2017 - {{ year }}, powered by SmartHoldem.
      </div>
    </div>
    -->
  </footer>
</div>
</template>

<script>
export default {
  name: "FooterFront",
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
}
</script>

<style scoped>
  .footer ul li {
    padding-bottom: 8px;

  }
  .footer ul {
    display: block;
    list-style-type: square;
  }

  .full-page .footer {
    position: relative !important;
  }

  @media (max-width: 768px) {
    .full-page > .content {
      /*padding-bottom: 850px !important;*/
    }
  }



</style>
