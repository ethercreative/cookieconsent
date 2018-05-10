import Cookies from 'cookies-js';

class EtherCookies
{
	constructor()
	{
		this.initCookies();
	}

	initCookies()
	{
		this.state = window.ether_cookie_settings;

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
		this.acceptBtn.innerText = this.stage.accept;
		this.acceptBtn.addEventListener('click', this.cta.bind(this));

		this.popover.appendChild(this.acceptBtn);

		document.body.appendChild(this.popover);

		setTimeout(() => this.popover.classList.add('active'), 1500);
	}

	togglePopover()
	{
		if(this.state.stage === 'accepted')
			this.state.stage = 'already_accepted';

		this.updateText();

		this.popover.classList.toggle('hidden');

		if(this.state.stage !== 'default')
			this.btn.classList.toggle('managed');
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

		const close = document.createElement('a');
		close.classList.add('e_close');
		close.classList.add('e_cta');
		close.innerText = 'Close preferences';
		close.addEventListener('click', this.closeModal.bind(this));

		content.appendChild(close);

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

		Cookies.set(this.state.cookieName, 'false', { expires: cookieLength, path: '/' });

		this.state.stage = 'declined';
	}

	acceptCookies()
	{
		const time = new Date().getTime();
		const cookieLength = parseInt(this.state.cookieLength);

		Cookies.set(this.state.cookieName, 'true', { expires: cookieLength, path: '/' });
		Cookies.set(this.state.cookieName + '_time', time, { cookieLength, path: '/' });

		this.state.stage = 'accepted';

		this.updateText();
	}

	toggleCookies(e)
	{
		if(!e && !e.target)
			return;

		switch(e.target.checked)
		{
			case true:
				this.acceptCookies();
			break;

			default:
				this.declineCookies();
			break;
		}
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

	cta()
	{
		switch(this.state.stage)
		{
			case 'accepted':
				this.closeCookies();
			break;

			case 'declined':
			case 'already_accepted':
				this.openModal();
			break;

			default:
				this.acceptCookies();
			break;
		}
	}

	updateText()
	{
		this.stage = this.state[this.state.stage];

		this.closeBtn.innerText = this.stage.close;
		this.acceptBtn.innerText = this.stage.accept;
		this.description.innerHTML = this.stage.description;
	}
}

new EtherCookies();
