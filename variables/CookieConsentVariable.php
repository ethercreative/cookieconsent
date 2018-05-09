<?php
namespace Craft;

class CookieConsentVariable
{
	public function init()
	{
		return craft()->cookieConsent->insert();
	}
}
