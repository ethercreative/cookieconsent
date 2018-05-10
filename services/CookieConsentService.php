<?php
namespace Craft;

class CookieConsentService extends BaseApplicationComponent
{
	public function insert()
	{
		$settings = craft()->plugins->getPlugin('cookieConsent')->getSettings();

		$url = craft()->getSiteUrl();
		$icon = UrlHelper::getResourceUrl('cookieconsent/images/' . strtolower($settings->cookieIcon) . '.png');
		$cookieName = $settings->cookieName;
		$accepted = $_COOKIE[$cookieName] ?? null;
		$time = $_COOKIE[$cookieName . '_time'] ?? 0;
		$stage = 'default';

		if($accepted === 'false')
			$stage = 'declined';

		if($accepted === 'true')
			$stage = 'already_accepted';

		$state = [
			'baseUrl' => craft()->getSiteUrl(),
			'icon' => $icon,
			'cookieName' => $cookieName,
			'cookieLength' => $settings->consentExpiry,
			'time' => $time,
			'stage' => $stage,
			'title' => 'Cookie Consent',
			'default' => [
				'close' => 'No thanks!',
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
				'accept' => 'Close message',
				'description' => $settings->consentMessage
			],
			'already_accepted' => [
				'close' => 'Close',
				'accept' => 'Manage cookie preferences',
				'description' => $settings->consentStatusYes
			],
			'modal' => [
				'title' => 'Cookie Preferences',
				'close' => 'Close',
				'subtitle' => 'How can I change my cookie settings?',
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

		craft()->templates->includeJs("
const ether_style = document.createElement('link');
ether_style.href = '{$css}';
ether_style.rel = 'stylesheet';
document.body.appendChild(ether_style);
");

		$js = UrlHelper::getResourceUrl('cookieconsent/js/cookies.min.js');

		craft()->templates->includeJs("
const ether_script = document.createElement('script');
ether_script.src = '{$js}';
ether_script.defer = true;
document.body.appendChild(ether_script);
");
	}

	public function checkConsent()
	{
		$settings = craft()->plugins->getPlugin('cookieConsent')->getSettings();

		$cookieName = $settings->cookieName;
		$accepted = $_COOKIE[$cookieName] ?? null;

		return $accepted;
	}
}
