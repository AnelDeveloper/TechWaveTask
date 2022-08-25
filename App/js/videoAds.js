

var adsManager;
var adsLoader;
var adDisplayContainer;
var playButton;
var videoContent;

const buttonDestroy = document.getElementById('mainContainer');


function init() {
    videoContent = document.getElementById('contentElement');
    videoContent.addEventListener('ended', contentEnded);
    requestAds();

}


buttonDestroy.addEventListener('click',
    function handleClick(event) {
        buttonDestroy.remove();
    });

function createAdDisplayContainer() {

    adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById('adContainer'), videoContent);
}

function requestAds() {
    google.ima.settings.setPlayerType('google/codepen-demo-manual-ad-breaks');
    google.ima.settings.setPlayerVersion('1.0.0');
    createAdDisplayContainer();
    adDisplayContainer.initialize();
    videoContent.load();
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.getSettings().setAutoPlayAdBreaks(false);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&' +
        'iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&' +
        'impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&' +
        'cmsid=496&vid=short_onecue&correlator=';


    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 400;

    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoContent, adsRenderingSettings);

    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);

    adsManager.addEventListener(
        google.ima.AdEvent.Type.AD_BREAK_READY,
        adBreakReadyHandler);

    try {
        adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
    } catch (adError) {
        videoContent.play();
    }
}

function onAdEvent(adEvent) {
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            if (!ad.isLinear()) {
                videoContent.play();
            }
            break;
    }
}

function onAdError(adErrorEvent) {
    console.log(adErrorEvent.getError());
    adsManager.destroy();
}

function onContentPauseRequested() {
    videoContent.pause();

}

function onContentResumeRequested() {
    videoContent.play();


}

function adBreakReadyHandler(adEvent) {
    console.log(adEvent.getAdData());


    adsManager.start();
}

function contentEnded() {
    adsLoader.contentComplete();
}

init();