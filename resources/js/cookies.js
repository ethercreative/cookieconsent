import Cookies from 'js-cookie';

class EtherCookies
{
	constructor()
	{
		this.initCookies();
	}

	initCookies()
	{
		this.state = window.ether_cookie_settings;
		this.updated = false;

		this.createPopover();
		this.createBtn();
		this.createModal();
	}

	createPopover()
	{
		this.stage = this.state[this.state.stage];

		this.popover = document.createElement('div');
		this.popover.id = 'ether_cookies';

		if(this.state.stage !== 'default')
			this.popover.classList.add('hidden');

		// top bar

		const top = document.createElement('div');
		top.classList.add('e_top');

		const title = document.createElement('span');
		title.innerText = this.state.title;

		top.appendChild(title);

		this.closeBtn = document.createElement('a');
		this.closeBtn.innerText = this.stage.close;
		this.closeBtn.addEventListener('click', this.closeCookies.bind(this));

		top.appendChild(this.closeBtn);

		this.popover.appendChild(top);

		// text

		this.description = document.createElement('div');
		this.description.classList.add('e_text');
		this.description.innerHTML = this.stage.description;

		this.popover.appendChild(this.description);

		// button

		this.acceptBtn = document.createElement('a');
		this.acceptBtn.classList.add('e_accept');
		this.acceptBtn.classList.add('e_cta');
		this.acceptBtn.classList.add('e_primary_btn');
		this.acceptBtn.innerText = this.stage.accept;
		this.acceptBtn.addEventListener('click', this.popoverCta.bind(this));

		if(this.state.stage !== 'default')
			this.acceptBtn.classList.add('e_secondary_btn');

		this.popover.appendChild(this.acceptBtn);

		document.body.appendChild(this.popover);

		setTimeout(() => this.popover.classList.add('active'), 1500);
	}

	createBtn()
	{
		this.btn = document.createElement('a');
		this.btn.id = 'ether_cookies_btn';
		this.btn.addEventListener('click', this.togglePopover.bind(this));

		if(this.state.stage !== 'default')
			this.btn.classList.add('managed');

		const cookie = document.createElement('img');
		cookie.src = this.state.icon;

		this.btn.appendChild(cookie);

		document.body.appendChild(this.btn);

		setTimeout(() => this.btn.classList.add('active'), 1000);
	}

	createModal()
	{
		this.modal = document.createElement('div');
		this.modal.id = 'ether_cookies_modal';

		// bg

		const bg = document.createElement('div');
		bg.classList.add('e_bg');
		bg.addEventListener('click', this.closeModal.bind(this));

		this.modal.appendChild(bg);

		// content

		const content = document.createElement('div');
		content.classList.add('e_content');

		// top bar

		const top = document.createElement('div');
		top.classList.add('e_top');

		const title = document.createElement('span');
		title.innerText = this.state.modal.title;

		top.appendChild(title);

		const closeBtn = document.createElement('a');
		closeBtn.innerText = this.state.modal.close;
		closeBtn.addEventListener('click', this.closeModal.bind(this));

		top.appendChild(closeBtn);

		content.appendChild(top);

		// description

		const description = document.createElement('div');
		description.classList.add('e_description');
		description.classList.add('e_block');

		const subtitle = document.createElement('span');
		subtitle.innerText = this.state.modal.subtitle;

		description.appendChild(subtitle);

		const descriptionText = document.createElement('p');
		descriptionText.innerHTML = this.state.modal.description;

		description.appendChild(descriptionText);

		content.appendChild(description);

		// switches

		const switches = document.createElement('div');
		switches.classList.add('e_switches');
		switches.classList.add('e_block');

		Object.keys(this.state.modal.switches).map(key =>
		{
			const toggle = this.state.modal.switches[key];

			const wrapper = document.createElement('div');
			wrapper.classList.add('e_row');

			const label = document.createElement('label');
			label.classList.add('e_label');

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = toggle.checked;

			if(!toggle.enabled)
				checkbox.disabled = true;
			else
				checkbox.addEventListener('change', this.toggleCookies.bind(this));

			label.appendChild(checkbox);

			const small = document.createElement('small');
			label.appendChild(small);

			const lightswitch = document.createElement('div');
			lightswitch.classList.add('lightswitch');

			label.appendChild(lightswitch);

			wrapper.appendChild(label);

			const text = document.createElement('div');
			text.classList.add('e_text');

			const title = document.createElement('span');
			title.innerText = toggle.title;

			text.appendChild(title);

			const description = document.createElement('p');
			description.innerHTML = toggle.description;

			text.appendChild(description);

			wrapper.appendChild(text);

			switches.appendChild(wrapper);
		});

		content.appendChild(switches);

		this.modalClose = document.createElement('a');
		this.modalClose.classList.add('e_close');
		this.modalClose.classList.add('e_cta');
		this.modalClose.classList.add('e_secondary_btn');
		this.modalClose.innerText = 'Close preferences';
		this.modalClose.addEventListener('click', this.modalCta.bind(this));

		content.appendChild(this.modalClose);

		this.modal.appendChild(content);

		document.body.appendChild(this.modal);

		window.addEventListener('keyup', (e) =>
		{
			if(e.keyCode === 27)
				this.closeModal();
		});
	}

	closeCookies()
	{
		if(this.state.stage.indexOf('accepted') === -1)
			this.declineCookies();

		this.popover.classList.add('hidden');
		this.btn.classList.toggle('managed');
	}

	declineCookies()
	{
		const cookieLength = parseInt(this.state.cookieLength);

		Cookies.set(this.state.cookieName, 'false', { expires: cookieLength });

		window.location.reload();
	}

	acceptCookies()
	{
		const time = new Date().getTime();
		const cookieLength = parseInt(this.state.cookieLength);

		Cookies.set(this.state.cookieName, 'true', { expires: cookieLength });
		Cookies.set(this.state.cookieName + '_time', time, { cookieLength });

		window.location.reload();
	}

	toggleCookies(e)
	{
		if(!e && !e.target)
			return;

		switch(e.target.checked)
		{
			case true:
				this.state.stage = 'accepted';
			break;

			default:
				this.state.stage = 'declined';
			break;
		}

		this.modalClose.innerText = 'Save preferences';
		this.modalClose.classList.remove('e_secondary_btn');
		this.modalClose.classList.add('e_primary_btn');

		this.updated = true;
	}

	popoverCta()
	{
		switch(this.state.stage)
		{
			case 'declined':
			case 'accepted':
				this.openModal();
			break;

			default:
				this.acceptCookies();
			break;
		}
	}

	modalCta()
	{
		if(!this.updated)
		{
			this.closeModal();
			return;
		}

		switch(this.state.stage)
		{
			case 'accepted':
				this.acceptCookies();
			break;

			default:
				this.declineCookies();
			break;
		}
	}

	togglePopover()
	{
		this.popover.classList.toggle('hidden');

		if(this.state.stage !== 'default')
			this.btn.classList.toggle('managed');
	}

	openModal()
	{
		this.togglePopover();
		this.modal.classList.add('active');
	}

	closeModal()
	{
		this.modal.classList.remove('active');
	}
}

new EtherCookies();
