<?php
namespace Craft;

class CookieConsentService extends BaseApplicationComponent
{
	public function insert()
	{
		$settings = craft()->plugins->getPlugin('cookieConsent')->getSettings();

		$url = str_replace('www.', '', $_SERVER['SERVER_NAME']);
		$icon = UrlHelper::getResourceUrl('cookieconsent/images/' . strtolower($settings->cookieIcon) . '.png');

		if($settings->cookieIconAsset !== '')
			$icon = craft()->assets->getFileById($settings->cookieIconAsset)->url;

		$cookieName = $settings->cookieName;
		$accepted = isset($_COOKIE[$cookieName]) ? $_COOKIE[$cookieName] : null;
		$time = isset($_COOKIE[$cookieName . '_time']) ? $_COOKIE[$cookieName . '_time'] : 0;
		$stage = 'default';

		if($accepted === 'false')
			$stage = 'declined';

		if($accepted === 'true')
			$stage = 'accepted';

		if($time !== 0)
			$time = date('jS F Y \a\t H:m', ($time / 1000));

		$state = [
			'siteUrl' => $url,
			'icon' => $icon,
			'cookieName' => $cookieName,
			'cookieLength' => $settings->consentExpiry,
			'time' => $time,
			'stage' => $stage,
			'title' => 'Cookie Consent',
			'default' => [
				'close' => 'No thanks',
				'accept' => 'Accept cookies on ' . $url,
				'description' => $settings->requestMessage
			],
			'declined' => [
				'close' => 'Close',
				'accept' => 'Manage cookie preferences',
				'description' => $settings->consentStatusNo
			],
			'accepted' => [
				'close' => 'Close',
				'accept' => 'Manage cookie preferences',
				'description' => str_replace('{date_time}', $time, $settings->consentStatusYes)
			],
			'modal' => [
				'title' => 'Cookie Preferences',
				'close' => 'Close',
				'subtitle' => $settings->prefSubtitle,
				'description' => $settings->prefOverview,
				'switches' => [
					'necessary' => [
						'enabled' => false,
						'checked' => true,
						'title' => 'Strictly necessary cookies',
						'description' => $settings->prefNecessaryCookies
					],
					'performance' => [
						'enabled' => true,
						'checked' => $accepted === 'true',
						'title' => 'Performance cookies',
						'description' => $settings->prefPerformanceCookies
					]
				]
			]
		];

		craft()->templates->includeJs('window.ether_cookie_settings = ' . json_encode($state));

		$css = UrlHelper::getResourceUrl('cookieconsent/css/layout.css');
		$js = UrlHelper::getResourceUrl('cookieconsent/js/cookies.min.js');

		craft()->templates->includeJs("
const ether_style = document.createElement('link');
ether_style.href = '{$css}';
ether_style.rel = 'stylesheet';

ether_style.addEventListener('load', function()
{
	const ether_script = document.createElement('script');
	ether_script.src = '{$js}';
	ether_script.defer = true;
	document.body.appendChild(ether_script);
});

document.head.appendChild(ether_style);
");

		craft()->templates->includeCss("
.e_primary_btn {
	background-color: {$settings->primaryColor} !important;
}

.e_secondary_btn {
	background-color: {$settings->secondaryColor} !important;
}

#ether_cookies p a, #ether_cookies_modal p a {
	color: {$settings->primaryColor} !important;
}
");

		if($settings->scriptInclude !== '' && $accepted === 'true')
			return TemplateHelper::getRaw(craft()->templates->render($settings->scriptInclude));

		return;
	}

	public function checkConsent()
	{
		$settings = craft()->plugins->getPlugin('cookieConsent')->getSettings();

		$cookieName = $settings->cookieName;
		$accepted = isset($_COOKIE[$cookieName]) ? $_COOKIE[$cookieName] : null;

		return $accepted === 'true';
	}
}
