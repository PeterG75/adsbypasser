(function () {

  _.register({
    rule: {
      host: [
        /^(www\.)?linkdrop\.net$/,
        /^dmus\.in$/,
        /^ulshare\.net$/,
        /^adurl\.id$/,
        /^goolink\.me$/,
        /^earningurl\.com$/,
        /^(cutwin|cut-earn)\.com$/,
        /^(cutwi|cut-w)\.in$/,
        /^(www\.)?(ourl|jurl)\.io$/,
        /^(urlcloud|mitly)\.us$/,
        /^adpop\.me$/,
        /^wi\.cr$/,
        /^tui\.click$/,
        /^megaurl\.in$/,
      ],
    },
    async ready () {
      $.remove('iframe, [class$="Overlay"]');
      $.block('[class$="Overlay"]', document.body);

      const f = getForm();
      if (!f) {
        _.info('no form');
        return;
      }

      sendRequest(f);
    },
  });

  _.register({
    rule: {
      host: [
        /^sflnk\.me$/,
        /^idsly\.com$/,
        /^adbilty\.me$/,
        /^oke\.io$/,
        /^linkrex\.net$/,
        /^3rabshort\.com$/,
        /^shink\.xyz$/,
        /^mlink\.club$/,
        /^zlshorte\.net$/,
        /^(igram|gram)\.im$/,
        /^(trlink|wolink)\.in$/,
      ],
    },
    async ready () {
      $.remove('iframe');

      let f = $.$('#captchaShortlink');
      if (f) {
        // recaptcha
        return;
      }
      f = getForm();
      if (!f) {
        f = $('#link-view');
        f.submit();
        return;
      }

      sendRequest(f);
    },
  });

  _.register({
    rule: {
      host: [
        /^adlink\.guru$/,
        /^clik\.pw$/,
        /^short\.pe$/,
        /^coshink\.co$/,
        /^(curs|cuon)\.io$/,
        /^cypt\.ga$/,
        /^(filesbucks|tmearn|cut-urls)\.com$/,
        /^adslink\.pw$/,
        /^dzurl\.ml$/,
        /^elink\.link$/,
        /^(payurl|urlst)\.me$/,
        /^u2s\.io$/,
        /^link4\.me$/,
        /^url\.ht$/,
        /^urle\.co$/,
        /^hashe\.in$/,
        /^www\.worldhack\.net$/,
        /^123link\.(io|co|press|pw)$/,
        /^pir\.im$/,
        /^bol\.tl$/,
        /^(tl|adfly|git)\.tc$/,
        /^(adfu|linkhits)\.us$/,
        /^short\.pastewma\.com$/,
        /^l2s\.io$/,
        /^adbilty\.in$/,
        /^gg-l\.xyz$/,
        /^linkfly\.gaosmedia\.com$/,
        /^linclik\.com$/,
        /^link-earn\.com$/,
        /^zeiz\.me$/,
        /^adbull\.me$/,
        /^adshort\.(in|im|pro)$/,
        /^(adshorte|adsrt)\.com$/,
        /^weefy\.me$/,
        /^bit-url\.com$/,
        /^premiumzen\.com$/,
        /^cut4links\.com$/,
        /^coinlink\.co$/,
      ],
    },
    async ready () {
      $.remove('iframe', '.BJPPopAdsOverlay');

      const page = await firstStage();
      const url = await secondStage(page);
      // nuke for bol.tl, somehow it will interfere click event
      $.nuke(url);
      await $.openLink(url);
    },
  });


  function getForm () {
    const jQuery = $.window.$;
    const f = jQuery('#go-link, .go-link, form[action="/links/go"], form[action="/links/linkdropgo"]');
    if (f.length > 0) {
      return f;
    }
    return null;
  }


  // XXX threw away promise
  function sendRequest (f) {
    const jQuery = $.window.$;
    jQuery.ajax({
      dataType: 'json',
      type: 'POST',
      url: f.attr('action'),
      data: f.serialize(),
      success: (result) => {
        if (result.url) {
          $.openLink(result.url);
        } else {
          _.warn(result.message);
        }
      },
      error: (xhr, status, error) => {
        _.warn(xhr, status, error);
      },
    });
  }


  function firstStage () {
    return new Promise((resolve) => {
      const f = $.$('#link-view');
      if (!f) {
        resolve(document);
        return;
      }

      const args = extractArgument(f);
      const url = f.getAttribute('action');
      const p = $.post(url, args).then((data) => {
        return $.toDOM(data);
      });
      resolve(p);
    });
  }


  async function secondStage (page) {
    const f = $('#go-link', page);
    const args = extractArgument(f);
    const url = f.getAttribute('action');
    let data = await $.post(url, args);
    data = JSON.parse(data);
    if (data && data.url) {
      return data.url;
    }
    throw new _.AdsBypasserError('wrong data');
  }


  function extractArgument (form) {
    const args = {};
    _.forEach($.$$('input', form), (v) => {
      args[v.name] = v.value;
    });
    return args;
  }

})();
