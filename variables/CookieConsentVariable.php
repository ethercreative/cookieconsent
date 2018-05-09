<?php
namespace Craft;

class CookieConsentVariable
{
	public function init()
	{
		return craft()->cookieConsent->insert();
	}

	public function check()
	{
		return craft()->cookieConsent->checkConsent();
	}
}
