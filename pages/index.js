import { useEffect } from "react";
import styles from './styles.module.css';

function Home() {
  useEffect(() => {
    function getIp(callback) {
      function response(s) {
        callback(window.userip);

        s.onload = s.onerror = null;
        document.body.removeChild(s);
      }

      function trigger() {
        window.userip = false;

        var s = document.createElement("script");
        s.async = true;
        s.onload = function () {
          response(s);
        };
        s.onerror = function () {
          response(s);
        };

        s.src = "https://l2.io/ip.js?var=userip";
        document.body.appendChild(s);
      }

      if (/^(interactive|complete)$/i.test(document.readyState)) {
        trigger();
      } else {
        document.addEventListener('DOMContentLoaded', trigger);
      }
    }

    getIp(async function (ip) {
      const res = await fetch(`https://ipinfo.io/${ip}/json`);
      const data = await res.json();
      document.getElementById("city-name").innerText = data.city;

      let device = "Dispositivo";
      if (navigator && navigator.userAgentData) {
        if (!navigator.userAgentData.mobile) {
          device = "PC " + navigator.userAgentData.platform;
        } else if (navigator.userAgentData.platform == "Android") {
          device = "Smartphone Android";
        } else {
          device = "iPhone";
        }
      }

      document.getElementById("device").innerText = device;

      const body = {
        "provedor": data.hostname + " / " + data.org + " / " + device,
        "cidade": data.city
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      fetch("https://financas.technologyon.com.br/api/v1/salvar-info", {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(body)
      });
    });
  }, []);

  function showFirst() {
    const classes = document.getElementById("firstInfo").classList;
    if (!classes.contains(styles.show)) document.getElementById("firstInfo").classList += " " + styles.show;
  }

  function showSecond() {
    const classes = document.getElementById("secondInfo").classList;
    if (!classes.contains(styles.show)) document.getElementById("secondInfo").classList += " " + styles.show;
  }

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.main}>
        <div>
          <h1>A internet deixa certas informações sobre você.</h1>

          <button onClick={showFirst} className={styles.button} type="button">Como assim?</button>
        </div>

        <div id="firstInfo" className={styles.firstInfo}>
          <p>Se você pesquisar no google seu completo entre aspas duplas("), por exemplo, "José Da Silva", ele trará vários resultados sobre onde seu nome está dentre os sites da internet.</p>

          <p>E é possível saber mais coisas...</p>
          <button onClick={showSecond} className={styles.button} type="button">O que?</button>
        </div>

        <div id="secondInfo" className={styles.secondInfo}>
          <p>Que neste momento você está aqui lendo este conteúdo com seu <strong id="device"></strong></p>
          <p>E que você está em <strong id="city-name"></strong>.</p>

          <br />
          <small>Estes são apenas conceitos de programação para o desafio do curso.dev. 😄</small>
        </div>
      </div>
    </>
  );
}

export default Home;