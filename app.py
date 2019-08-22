import logging
from bs4 import BeautifulSoup
import urllib.parse
import requests
import re


def setup_logging():
    logging.basicConfig(format='[%(asctime)s] %(levelname).1s %(message)s',
                        filename="parse.log",
                        datefmt='%Y.%m.%d %H:%M:%S',
                        level=logging.INFO)


def make_soup(url):
    response = requests.get(url)
    response.encoding = 'utf-8'
    response = response.text
    return BeautifulSoup(response, 'lxml')


def get_pages_quantity(url):
    soup = make_soup(url)
    pag = int(soup.find('div', {
        'class': 'pagination'
    }).find('span', {
        'class': 'frame'
    }).findAll('a')[-1].text)
    logging.info(f"Found {pag} pages")
    return pag


def main():
    print('Работа начата')
    logging.info("Start parsing")
    query = urllib.parse.quote('аптеки')  # <------------------ что будем искать
    start_link = f'https://spb.spravker.ru/search/{query}/'

    # Если ищем категорию - раскомментируем следующую строку
    # start_link = f'https://spb.spravker.ru/internet-magazinyi/'  # <-----------ссылка на категорию

    quantity = 0

    try:
        quantity = get_pages_quantity(start_link)
    except Exception as e:
        logging.error(f"Pagination failed. Message:{e}")

    reg = "^\s+|\n|\r|\t|\s+$"

    for counter in range(1, quantity + 1):
        print(f'Обработка страницы {counter}')
        if counter == 1:
            link = start_link
        else:
            link = f'https://spb.spravker.ru/search/page-{counter}/{query}/'
            # Если ищем категорию - раскомментируем следующую строку
            # link = f'https://spb.spravker.ru/internet-magazinyi/page-{counter}/'  # <-----------ссылка на категорию

        soup = make_soup(link)
        companies = soup.findAll('div', {
            'class': ['list-item', 'hover']
        })
        for company in companies:
            try:
                name = re.sub(reg, '', company.find('h3').text.strip())
                rows = company.findAll('div', {
                    'class': 'row'
                })
                adress = re.sub(reg, '', rows[0].text.strip())
                phone = re.sub(reg, '', rows[1].text.strip())
                with open('results.csv', 'a+') as file:
                    file.write(f'{name};{adress};{phone}\n')
            except Exception as e:
                logging.error(f"Problem with counter {counter}. Message:{e}")
                continue


if __name__ == '__main__':
    setup_logging()
    main()
    print('Работа завершена')
    logging.info("Script stopped")
